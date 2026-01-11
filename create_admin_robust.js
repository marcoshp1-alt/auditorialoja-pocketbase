import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function createFirstAdmin() {
    try {
        console.log('=== CRIANDO ESTRUTURA COMPLETA ===\n');

        // Tentar criar usuário admin
        console.log('1. Criando usuário admin...');
        let adminUser;
        try {
            adminUser = await pb.collection('users').create({
                username: 'admin',
                email: 'admin@sistema.local',
                emailVisibility: false,
                password: 'Auditoria@2026',
                passwordConfirm: 'Auditoria@2026'
            });
            console.log(`✅ Usuário criado: ${adminUser.id}`);
        } catch (e) {
            if (e.data?.username?.message?.includes('already in use')) {
                console.log('⚠️ Usuário já existe, buscando...');
                const users = await pb.collection('users').getFullList();
                adminUser = users.find(u => u.username === 'admin');
                if (!adminUser) {
                    console.log('Tentando buscar por email...');
                    adminUser = users.find(u => u.email === 'admin@sistema.local');
                }
                console.log(`✅ Admin encontrado: ${adminUser.id}`);
            } else {
                throw e;
            }
        }

        // Criar perfil vinculado
        console.log('\n2. Criando perfil admin...');
        try {
            const profile = await pb.collection('profiles').create({
                user: adminUser.id,
                username: 'Administrador',
                role: 'admin',
                loja: '204'
            });
            console.log(`✅ Perfil criado: ${profile.id}`);
        } catch (e) {
            if (e.message.includes('duplicate')) {
                console.log('⚠️ Perfil já existe');
                // Buscar e atualizar
                const profiles = await pb.collection('profiles').getFullList();
                const existingProfile = profiles.find(p => p.user === adminUser.id);
                if (existingProfile) {
                    await pb.collection('profiles').update(existingProfile.id, {
                        role: 'admin',
                        username: 'Administrador'
                    });
                    console.log('✅ Perfil atualizado');
                }
            } else {
                throw e;
            }
        }

        console.log('\n=== SUCESSO ===');
        console.log('Login: admin');
        console.log('Senha: Auditoria@2026');

    } catch (err) {
        console.error('\n❌ ERRO:', err.message);
        if (err.data) {
            console.error('Detalhes:', JSON.stringify(err.data, null, 2));
        }
    }
}

createFirstAdmin();
