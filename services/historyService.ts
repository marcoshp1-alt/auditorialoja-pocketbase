import { pb } from './pocketbase';
import { HistoryItem, UserProfile } from '../types';

// Busca apenas metadados leves para a barra lateral e listagens
export const fetchHistory = async (profile: UserProfile): Promise<HistoryItem[]> => {
  try {
    let filter = '';
    if (profile.role !== 'admin') {
      filter = `loja = "${profile.loja}"`;
    } else if (profile.visibleLojas && profile.visibleLojas.length > 0) {
      filter = profile.visibleLojas.map(l => `loja = "${l}"`).join(' || ');
    }

    console.log('🔍 Buscando histórico com filtro:', filter || 'NENHUM (ADMIN - VER TUDO)');

    const records = await pb.collection('audit_history').getList(1, 100, {
      sort: '-created',
      filter: filter
    });

    return records.items.map((row: any) => ({
      id: row.id,
      timestamp: new Date(row.created).getTime(),
      fileName: row.fileName,
      reportType: row.reportType,
      data: [], // Vazio por padrão no fetch leve
      classDetails: [],
      categoryStats: null,
      collaboratorStats: null,
      stats: row.stats || { totalSku: 0, totalNotRead: 0, generalPartial: 0 },
      customDate: row.customDate,
      loja: row.loja || '204'
    }));
  } catch (error: any) {
    if (error.isAbort || error.status === 0) return [];
    console.error('Error fetching history:', error);
    throw error;
  }
};

// Busca os dados pesados (JSONB) de um único relatório
export const fetchHistoryItemDetails = async (id: string): Promise<any> => {
  try {
    const data = await pb.collection('audit_history').getOne(id);

    return {
      data: data.data || [],
      classDetails: data.classDetails || [],
      categoryStats: data.categoryStats || null,
      collaboratorStats: data.collaboratorStats || null
    };
  } catch (error: any) {
    if (error.isAbort || error.status === 0) return null;
    console.error('Error fetching item details:', error);
    throw error;
  }
};

export const addHistoryItem = async (item: HistoryItem): Promise<void> => {
  const payload = {
    fileName: item.fileName,
    reportType: item.reportType,
    customDate: item.customDate || null,
    stats: item.stats,
    data: item.data || [],
    classDetails: item.classDetails || [],
    categoryStats: item.categoryStats || null,
    collaboratorStats: item.collaboratorStats || null,
    loja: item.loja || '204'
  };

  try {
    await pb.collection('audit_history').create(payload);
  } catch (error: any) {
    console.error('Error adding history item:', error);
    if (error.data) {
      console.error('Validation errors:', JSON.stringify(error.data, null, 2));
    }
    throw error;
  }
};

export const updateHistoryItemDate = async (id: string, newDate: string): Promise<void> => {
  try {
    await pb.collection('audit_history').update(id, {
      customDate: newDate
    });
  } catch (error) {
    console.error('Error updating history item date:', error);
    throw error;
  }
};

export const deleteHistoryItemById = async (id: string): Promise<void> => {
  try {
    await pb.collection('audit_history').delete(id);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const deleteAllHistory = async (): Promise<void> => {
  try {
    // PocketBase não tem "delete all" nativo simples via SDK sem loop ou batch
    // Como é uma operação de risco, vamos apenas avisar ou implementar via loop controlado
    const records = await pb.collection('audit_history').getFullList();
    for (const record of records) {
      await pb.collection('audit_history').delete(record.id);
    }
  } catch (error) {
    console.error('Error deleting all history:', error);
    throw error;
  }
};
