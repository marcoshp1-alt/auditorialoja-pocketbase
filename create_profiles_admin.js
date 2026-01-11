import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function createProfilesAsAdmin() {
    try {
        // IMPORTANTE: Substitua com o email e senha do admin do PocketBase
        const ADMIN_EMAIL = 'marcoshp1@gmail.com';
        const ADMIN_PASSWORD = 'ysoy4T$7p2';

        console.log('=== AUTENTICANDO COMO ADMIN DO POCKETBASE ===');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Autenticado com sucesso!\n');

        console.log('=== BUSCANDO USUÁRIOS ===');
        const users = await pb.collection('users').getFullList();
        console.log(`Encontrados ${users.length} usuários.\n`);

        console.log('=== CRIANDO PERFIS ===');
        for (const user of users) {
            const username = user.username || user.email?.split('@')[0] || 'usuario';

            // Definir role baseado no username
            let role = 'user';
            let loja = '204';

            if (username === 'admin') {
                role = 'admin';
            } else if (username.includes('loja')) {
                const lojaMatch = username.match(/\d+/);
                if (lojaMatch) {
                    loja = lojaMatch[0];
                }
            }

            console.log(`Criando perfil: ${username} (role: ${role}, loja: ${loja})...`);

            try {
                await pb.collection('profiles').create({
                    user: user.id,
                    username: username,
                    role: role,
                    loja: loja
                });
                console.log(`✅ ${username}`);
            } catch (e) {
                console.error(`❌ ${username}: ${e.message}`);
                if (e.data) {
                    console.error('Detalhes:', e.data);
                }
            }
        }

        console.log('\n=== CONCLUÍDO ===');
        console.log('Verifique o painel do PocketBase!');

    } catch (err) {
        console.error('\n❌ ERRO:', err.message);
        console.error('\nVERIFIQUE:');
        console.error('1. O email e senha do admin do PocketBase estão corretos?');
        console.error('2. Você tem permissão de admin no PocketBase?');
    }
}

createProfilesAsAdmin();
