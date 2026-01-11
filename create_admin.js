import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function createAdminDirectly() {
    try {
        console.log('--- Criando usuário admin manualmente ---');

        // 1. Criar usuário no Auth
        const adminUser = await pb.collection('users').create({
            username: 'admin',
            email: 'admin@sistema.local',
            emailVisibility: true,
            password: 'Auditoria@2026',
            passwordConfirm: 'Auditoria@2026',
            verified: true
        });

        console.log(`✅ Usuário criado: ${adminUser.id}`);

        // 2. Criar perfil vinculado
        const adminProfile = await pb.collection('profiles').create({
            user: adminUser.id,
            username: 'Administrador',
            role: 'admin',
            loja: '204'
        });

        console.log(`✅ Perfil criado e vinculado com role: ${adminProfile.role}`);
        console.log('\n--- SUCESSO ---');
        console.log('Login: admin');
        console.log('Senha: Auditoria@2026');

    } catch (err) {
        console.error('❌ Erro:', err);
        if (err.data) {
            console.error('Detalhes:', JSON.stringify(err.data, null, 2));
        }
    }
}

createAdminDirectly();
