import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function fixAdminProfile() {
    try {
        console.log('--- Buscando usuário admin existente ---');

        // 1. Buscar usuário admin no Auth
        const existingAdmin = await pb.collection('users').getFirstListItem('username="admin"');
        console.log(`✅ Admin encontrado: ${existingAdmin.id}`);

        // 2. Verificar se já tem perfil
        try {
            const existingProfile = await pb.collection('profiles').getFirstListItem(`user="${existingAdmin.id}"`);
            console.log(`Perfil já existe: Role=${existingProfile.role}`);

            // Atualizar se não for admin
            if (existingProfile.role !== 'admin') {
                await pb.collection('profiles').update(existingProfile.id, {
                    role: 'admin',
                    username: 'Administrador',
                    loja: '204'
                });
                console.log('✅ Perfil atualizado para admin!');
            }
        } catch (e) {
            // Perfil não existe, criar
            console.log('Perfil não encontrado, criando...');
            await pb.collection('profiles').create({
                user: existingAdmin.id,
                username: 'Administrador',
                role: 'admin',
                loja: '204'
            });
            console.log('✅ Perfil admin criado!');
        }

        console.log('\n--- SUCESSO ---');
        console.log('Faça login com:');
        console.log('Usuário: admin');
        console.log('Senha: Auditoria@2026');

    } catch (err) {
        console.error('❌ Erro:', err.message);
    }
}

fixAdminProfile();
