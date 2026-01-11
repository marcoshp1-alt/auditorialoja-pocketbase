import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function deeplyDebugAuth() {
    try {
        console.log('--- LISTA DE USUÁRIOS (AUTH) ---');
        const users = await pb.collection('users').getFullList();
        users.forEach(u => {
            console.log(`ID: ${u.id} | User: ${u.username} | Email: ${u.email}`);
        });

        console.log('\n--- LISTA DE PERFIS (PROFILES) ---');
        const profiles = await pb.collection('profiles').getFullList();
        profiles.forEach(p => {
            console.log(`ID: ${p.id} | UserLink: ${p.user} | UsernameField: ${p.username} | Role: ${p.role}`);
        });

        // Verificar especificamente o admin
        const adminUser = users.find(u => u.username === 'admin');
        if (adminUser) {
            const adminProfile = profiles.find(p => p.user === adminUser.id);
            console.log('\n--- STATUS DO ADMIN ---');
            if (adminProfile) {
                console.log(`✅ Admin vinculado corretamente. Role: ${adminProfile.role}`);
            } else {
                console.log('❌ Admin NÃO tem perfil vinculado!');
            }
        } else {
            console.log('❌ Usuário "admin" não encontrado no Auth!');
        }

    } catch (err) {
        console.error('Erro no debug:', err.message);
    }
}

deeplyDebugAuth();
