import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function createAllProfiles() {
    try {
        console.log('=== CRIANDO PERFIS PARA TODOS OS USUÁRIOS ===\n');

        // 1. Buscar todos os usuários
        const users = await pb.collection('users').getFullList();
        console.log(`Encontrados ${users.length} usuários.`);

        // 2. Para cada usuário, criar perfil
        for (const user of users) {
            const username = user.username || user.email?.split('@')[0] || 'usuario';

            // Definir role baseado no username
            let role = 'user';
            let loja = '204';

            if (username === 'admin') {
                role = 'admin';
            } else if (username.startsWith('loja')) {
                // Extrair número da loja se possível
                const lojaMatch = username.match(/loja(\d+)/);
                if (lojaMatch) {
                    loja = lojaMatch[1];
                }
            }

            console.log(`Criando perfil para: ${username} (role: ${role}, loja: ${loja})...`);

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
            }
        }

        console.log('\n=== CONCLUÍDO ===');
        console.log('Agora você pode fazer login com:');
        console.log('Usuário: admin');
        console.log('Senha: Auditoria@2026');

    } catch (err) {
        console.error('❌ ERRO:', err.message);
    }
}

createAllProfiles();
