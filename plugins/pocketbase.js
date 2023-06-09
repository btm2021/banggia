import PocketBase from  'pocketbase';

export default async (ctx, inject) => {

  const pb = new PocketBase('https://tiemvang.fly.dev/');
  inject('pocketbase', pb);
};