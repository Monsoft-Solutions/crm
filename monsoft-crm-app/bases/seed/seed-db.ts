import * as seeds from './seeds';

// function used to seed the db
export async function seedDb() {
    console.log('seeding DB...');

    for (const seed of Object.values(seeds)) {
        await seed();
    }

    console.log('DB seeded !');
}
