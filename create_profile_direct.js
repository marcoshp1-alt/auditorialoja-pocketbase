import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function createProfileDirectly() {
    try {
        console.log('=== TENTANDO CRIAR PERFIL ADMIN DIRETAMENTE ===\n');

        // Tenta criar um perfil diretamente (para coleções públicas)
        const profile = await pb.collection('profiles').create({
            user: '5adefac8f29f', // ID do usuário admin (visto na imagem: 5adefac8f29f)
            username: 'Administrador',
            role: 'admin',
            loja: '204'
        });

        console.log('✅ SUCESSO! Perfil criado:', profile);
        console.log('\nAgora faça login com:');
        console.log('Usuário: admin');
        console.log('Senha: Auditoria@2026');

    } catch (err) {
        console.error('❌ ERRO:', err.message);
        if (err.data) {
            console.error('Detalhes:', JSON.stringify(err.data, null, 2));
        }

        console.log('\n--- SOLUÇÃO MANUAL ---');
        console.log('Se o erro persistir, crie manualmente no painel:');
        console.log('1. Acesse: http://152.67.62.41:8090/_/');
        console.log('2. Vá em Collections > profiles');
        console.log('3. Clique em "+ New record"');
        console.log('4. No campo "user", cole: 5adefac8f29f');
        console.log('5. username: Administrador');
        console.log('6. role: admin');
        console.log('7. loja: 204');
    }
}

createProfileDirectly();
