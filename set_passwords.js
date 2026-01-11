import PocketBase from 'pocketbase';

// 1. CONFIGURAÇÕES POCKETBASE
const pb = new PocketBase('http://152.67.62.41:8090');

// SENHA PADRÃO QUE SERÁ DEFINIDA
const DEFAULT_PASSWORD = 'Auditoria@2026';

async function setPasswords() {
    console.log(`--- Definindo Senha Padrão: ${DEFAULT_PASSWORD} ---`);

    try {
        // Buscando todos os usuários da coleção 'users'
        // Nota: Isso pode exigir login de admin se as permissões não estiverem abertas
        const users = await pb.collection('users').getFullList();

        console.log(`Encontrados ${users.length} usuários.`);

        for (const user of users) {
            // Ignorar se for o usuário admin original se você souber o email/username
            console.log(`Atualizando senha para: ${user.username || user.email}...`);

            try {
                // No PocketBase, para atualizar a senha via API de cliente, 
                // geralmente o usuário precisaria estar logado ou ser um admin.
                // Como este é um processo de migração, usaremos a API de admin se possível.
                await pb.collection('users').update(user.id, {
                    password: DEFAULT_PASSWORD,
                    passwordConfirm: DEFAULT_PASSWORD,
                });
                console.log(`✅ Sucesso: ${user.username}`);
            } catch (err) {
                console.error(`❌ Falha ao atualizar ${user.username}:`, err.message);
            }
        }

        console.log('\n--- PROCESSO CONCLUÍDO ---');
        console.log(`\nTodos os usuários agora podem acessar com a senha: ${DEFAULT_PASSWORD}`);

    } catch (err) {
        console.error('ERRO AO ACESSAR LISTA DE USUÁRIOS:', err.message);
        console.log('\n--- DICA ---');
        console.log('Se este erro for "403 Forbidden", você precisará logar como ADMIN no script.');
    }
}

setPasswords();
