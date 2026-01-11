import PocketBase from 'pocketbase';

const pb = new PocketBase('http://152.67.62.41:8090');

async function checkSchema() {
    try {
        const profile = await pb.collection('profiles').getFirstListItem('');
        console.log('--- Fields in "profiles" collection ---');
        console.log(Object.keys(profile));
        console.log('--- Sample Record ---');
        console.log(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
    }
}

checkSchema();
