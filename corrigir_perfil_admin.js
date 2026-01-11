import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function corrigirPerfilAdmin() {
    try {
        // 1. Buscar o usuário admin
        const adminUser = await pb.collection('users').getFirstListItem('username="admin"');
        console.log('✅ Usuário admin encontrado:');
        console.log('  ID:', adminUser.id);
        console.log('  Username:', adminUser.username);
        console.log('  Email:', adminUser.email);

        // 2. Buscar todos os perfis
        const allProfiles = await pb.collection('profiles').getFullList();
        console.log('\n📋 Todos os perfis:', allProfiles.length);

        // 3. Verificar se existe perfil com user=adminUser.id
        const adminProfile = allProfiles.find(p => p.user === adminUser.id);

        if (adminProfile) {
            console.log('\n✅ Perfil admin JÁ ESTÁ CORRETO:');
            console.log('  ID do perfil:', adminProfile.id);
            console.log('  Username:', adminProfile.username);
            console.log('  Role:', adminProfile.role);
            console.log('  User ID:', adminProfile.user);
        } else {
            console.log('\n⚠️ Perfil admin NÃO está vinculado corretamente!');

            // Procurar perfil por username
            const profileByName = allProfiles.find(p =>
                p.username.toLowerCase().includes('admin') ||
                p.role === 'admin'
            );

            if (profileByName) {
                console.log('\n🔧 Encontrei perfil desvinculado:');
                console.log('  ID:', profileByName.id);
                console.log('  Username:', profileByName.username);
                console.log('  Role:', profileByName.role);
                console.log('  User atual:', profileByName.user);

                console.log('\n🔧 Atualizando vínculo...');
                await pb.collection('profiles').update(profileByName.id, {
                    user: adminUser.id
                });

                console.log('✅ Perfil corrigido com sucesso!');
            } else {
                console.log('\n⚠️ Nenhum perfil admin encontrado!');
                console.log('Criando novo perfil...');

                await pb.collection('profiles').create({
                    user: adminUser.id,
                    username: 'Administrador',
                    role: 'admin',
                    loja: '204'
                });

                console.log('✅ Novo perfil admin criado!');
            }
        }

    } catch (err) {
        console.error('❌ Erro:', err);
    }
}

corrigirPerfilAdmin();
