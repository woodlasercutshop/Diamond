// Настройки DIAMOND. Ключ anon публичный, его можно хранить на GitHub.
window.CLOUD_CFG = {
  // 1. Облако Supabase. Без них приложение работает только на телефоне.
  url: 'https://gkwjmovuvuxzwowmspke.supabase.co/rest/v1/',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2ptb3Z1dnV4endvd21zcGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNzcxMjEsImV4cCI6MjExMDg1MzEyMX0.Fv4H_VbDh5OBrYff0Q2e6zNaf1GPRlxnTRXuk_GRUvQ',

  // 2. Контакты и оплата. Они закреплены здесь, чтобы мошенник не подменил номер оплаты через облако.
  //    Чтобы изменить номер, отредактируйте этот файл на GitHub.
  contacts: {
    wa: '77059876985',
    tel: '77023211681',
    kp: '77479191822',
    addr: 'Алматы'
  },

  // 3. Ключ подписи мастера. Скопируйте его из Настройки → Безопасность после создания пароля.
  //    Пока поле пустое, защита подписью выключена.
  masterKey: 'BAouASGBMiEmWxSmNnjdPGoJ-73NljaGJDxd-KOWHy64S8T1Cy5VveYRk8KiOpjehOPfhQWqTvr-VeIbNreroxU'
};
