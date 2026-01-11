import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function checkProfiles() {
    try {
        const profiles = await pb.collection('profiles').getFullList();
        console.log('--- Perfis no PocketBase ---');
        profiles.forEach(p => {
            console.log(`Usuário: ${p.fullName}, Role: ${p.role}, Loja: ${p.loja}, UserId: ${p.userId}`);
        });
    } catch (err) {
        console.error('Erro ao buscar perfis:', err.message);
    }
}

checkProfiles();
