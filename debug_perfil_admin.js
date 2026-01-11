import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function debugProfile() {
    try {
        // Login como admin
        await pb.collection('users').authWithPassword('admin@sistema.local', 'Auditoria@2026');
        console.log('✅ Login OK, ID do usuário:', pb.authStore.model.id);

        // Listar todos os perfis
        const allProfiles = await pb.collection('profiles').getFullList();
        console.log('📋 Todos os perfis:', allProfiles);

        // Buscar perfil do admin
        const userId = pb.authStore.model.id;
        console.log('🔍 Procurando perfil para user ID:', userId);

        try {
            const profile = await pb.collection('profiles').getFirstListItem(`user="${userId}"`);
            console.log('✅ Perfil encontrado:', profile);
        } catch (e) {
            console.error('❌ Perfil não encontrado:', e);

            // Tentar buscar de outra forma
            const profileByUsername = allProfiles.find(p => p.username === 'admin' || p.username === 'Administrador');
            console.log('🔍 Busca por username:', profileByUsername);
        }

    } catch (err) {
        console.error('❌ Erro:', err);
    }
}

debugProfile();
