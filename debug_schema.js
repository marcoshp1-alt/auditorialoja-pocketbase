import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function debugSchema() {
    try {
        console.log('--- Esquema audit_history ---');
        const hRecords = await pb.collection('audit_history').getFullList(1);
        if (hRecords.length > 0) {
            console.log(JSON.stringify(hRecords[0], null, 2));
        }

        console.log('\n--- Esquema profiles ---');
        const pRecords = await pb.collection('profiles').getFullList(1);
        if (pRecords.length > 0) {
            console.log(JSON.stringify(pRecords[0], null, 2));
        }
    } catch (err) {
        console.error('Erro:', err.message);
    }
}

debugSchema();
