// Script de teste para o console do navegador
// Cole este código no console para testar as operações do PocketBase

import PocketBase from 'http://localhost:5173/node_modules/pocketbase/dist/pocketbase.es.mjs';

const pb = new PocketBase('http://152.67.62.41:8090');

// Teste 1: Listar perfis
console.log('=== TESTE 1: Listar Perfis ===');
try {
    const profiles = await pb.collection('profiles').getFullList();
    console.log('✅ Perfis encontrados:', profiles.length);
    console.log(profiles);
} catch (e) {
    console.error('❌ Erro ao listar perfis:', e);
}

// Teste 2: Criar usuário
console.log('\n=== TESTE 2: Criar Usuário ===');
try {
    const newUser = await pb.collection('users').create({
        username: 'teste123',
        email: 'teste123@sistema.local',
        password: 'senha12345',
        passwordConfirm: 'senha12345'
    });
    console.log('✅ Usuário criado:', newUser.id);

    // Criar perfil vinculado
    const newProfile = await pb.collection('profiles').create({
        user: newUser.id,
        username: 'Teste 123',
        role: 'user',
        loja: '204'
    });
    console.log('✅ Perfil criado:', newProfile.id);
} catch (e) {
    console.error('❌ Erro ao criar:', e);
    console.error('Detalhes:', e.data);
}

// Teste 3: Atualizar perfil
console.log('\n=== TESTE 3: Atualizar Perfil ===');
try {
    const profiles = await pb.collection('profiles').getFullList();
    if (profiles.length > 0) {
        const firstProfile = profiles[0];
        await pb.collection('profiles').update(firstProfile.id, {
            loja: '999'
        });
        console.log('✅ Perfil atualizado');
    }
} catch (e) {
    console.error('❌ Erro ao atualizar:', e);
}

console.log('\n=== TESTES CONCLUÍDOS ===');
