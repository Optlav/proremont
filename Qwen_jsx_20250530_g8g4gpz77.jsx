import { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('proremont_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      rating: 4.8,
      worksDone: 150,
      description: '',
      verified: false
    };
  });

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedExecutor, setSelectedExecutor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, name: 'Иван Петров', lastMessage: 'Вы: Отправил запрос на оценку работ', time: '10:30' }
  ]);

  // Mock данные
  const regions = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург'];
  const categories = [
    { id: 1, name: 'Доставка стройматериалов' },
    { id: 2, name: 'Строительство домов' },
    { id: 3, name: 'Ремонт квартир' },
    { id: 4, name: 'Инженерные работы' }
  ];

  const fixedPriceOrders = [
    { id: 1, title: 'Укладка плитки', price: 'от 800 ₽/м²', location: 'Москва' },
    { id: 2, title: 'Электромонтаж', price: 'от 1500 ₽/час', location: 'СПб' }
  ];

  const requestOrders = [
    { id: 1, title: 'Ремонт кухни', location: 'Москва' },
    { id: 2, title: 'Поклейка обоев', location: 'Казань' }
  ];

  const executors = [
    {
      id: 1,
      name: 'Иван Петров',
      rating: 4.9,
      works: 120,
      priceFrom: 1000,
      verified: profile.verified,
      services: ['Штукатурка стен', 'Укладка плитки'],
      location: 'Москва'
    },
    {
      id: 2,
      name: 'Андрей Смирнов',
      rating: 4.6,
      works: 75,
      priceFrom: 800,
      verified: false,
      services: ['Электромонтаж', 'Слаботочные сети'],
      location: 'Санкт-Петербург'
    },
    {
      id: 3,
      name: 'Строймастер',
      rating: 4.8,
      works: 200,
      priceFrom: 1200,
      verified: true,
      services: ['Сантехника', 'Монтаж труб'],
      location: 'Новосибирск'
    }
  ];

  const reviews = [
    { id: 1, user: 'Ольга', comment: 'Все отлично!', rating: 5 },
    { id: 2, user: 'Дмитрий', comment: 'Хорошо, но дорого.', rating: 4 }
  ];

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const submitReview = () => {
    if (!reviewText || rating === 0) return alert('Заполните поле и поставьте оценку');
    reviews.push({ id: reviews.length + 1, user: profile.name, comment: reviewText, rating });
    setReviewText('');
    setRating(0);
    alert('Ваш отзыв опубликован!');
  };

  // Сохранение профиля
  useEffect(() => {
    localStorage.setItem('proremont_profile', JSON.stringify(profile));
  }, [profile]);

  // Фильтрация исполнителей
  const filteredExecutors = executors.filter(executor => {
    const matchesSearch = executor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion ? executor.location === selectedRegion : true;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-indigo-600">ProРемонт</h1>
          {user ? (
            <button onClick={() => setUser(null)} className="text-red-600 hover:text-red-800 transition">
              Выйти
            </button>
          ) : (
            <button onClick={() => setActiveTab('login')} className="text-indigo-600 hover:text-indigo-800 transition">
              Войти
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Профессиональный ремонт без лишних забот</h1>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            Найдите проверенного исполнителя за считанные минуты
          </p>
          <button
            onClick={() => setActiveTab('executors')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Найти мастера
          </button>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Поиск по имени или названию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full md:w-1/3 lg:w-1/4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Выберите регион</option>
              {regions.map((region, idx) => (
                <option key={idx} value={region}>{region}</option>
              ))}
            </select>

            <button
              onClick={() => setActiveTab('post-order')}
              className="w-full md:w-1/3 lg:w-1/4 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Оставить заказ
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <nav className="flex space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Заказы
          </button>
          <button
            onClick={() => setActiveTab('executors')}
            className={`px-4 py-2 rounded ${activeTab === 'executors' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Исполнители
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded ${activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Категории
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 rounded ${activeTab === 'monitoring' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Цены
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded ${activeTab === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            Админ
          </button>
        </nav>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExecutors.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg">{order.title}</h3>
                <p>Цена: <span className="text-green-600">{order.price}</span></p>
                <p>Локация: {order.location}</p>
                <p>Срок: {order.deadline}</p>
                <button
                  onClick={() => alert('CAPTCHA: Подтвердите, что вы не робот')}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Откликнуться
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Executors Tab */}
        {activeTab === 'executors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExecutors.map((executor) => (
              <div key={executor.id} className="bg-white rounded-lg shadow p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{executor.name}</h3>
                  {executor.verified && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">VERIFIED</span>
                  )}
                </div>
                <p>Рейтинг: ★{executor.rating}</p>
                <p>Выполнено работ: {executor.works}</p>
                <p>Цена от: {executor.priceFrom} ₽/час</p>
                <button
                  onClick={() => setShowChat(true)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                >
                  Написать
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="text-center">
                <img src="https://placehold.co/50x50"  alt={category.name} className="mx-auto mb-2 rounded" />
                <p>{category.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow p-5">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p>Средняя цена: <span className="text-green-600">от 2000 ₽/м²</span></p>
              </div>
            ))}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">Редактировать профиль</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block mb-2">Имя</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Телефон</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Описание</label>
                <textarea
                  rows="4"
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>
              <div>
                <label className="block mb-2">Рейтинг</label>
                <input
                  type="text"
                  value={`${profile.rating}`} readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-2">Выполнено работ</label>
                <input
                  type="text"
                  value={profile.worksDone}
                  onChange={(e) => setProfile({ ...profile, worksDone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    localStorage.setItem('proremont_profile', JSON.stringify(profile));
                    alert('Профиль сохранен!');
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post Order Form */}
        {activeTab === 'post-order' && (
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">Оставьте свой заказ</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Название работы</label>
                  <input
                    type="text"
                    placeholder="Например: Ремонт кухни"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Описание</label>
                  <textarea
                    rows="4"
                    placeholder="Опишите детали"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Категория</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-medium">Бюджет</label>
                    <input
                      type="text"
                      placeholder="Например: от 50 000 ₽"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Срок выполнения</label>
                    <input
                      type="text"
                      placeholder="Например: 1 месяц"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => alert('Заказ успешно опубликован!')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Опубликовать
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Admin Panel */}
        {activeTab === 'admin' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-4">Админ-панель</h2>
            <table className="w-full table-auto mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">ID</th>
                  <th className="p-2">Имя</th>
                  <th className="p-2">Роль</th>
                  <th className="p-2">Верифицирован</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">1</td>
                  <td className="p-2">Иван Петров</td>
                  <td className="p-2">executor</td>
                  <td className="p-2">✅</td>
                </tr>
                <tr>
                  <td className="p-2">2</td>
                  <td className="p-2">Ольга Смирнова</td>
                  <td className="p-2">customer</td>
                  <td className="p-2">❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg w-full max-w-md p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">Чат с исполнителем</h3>
              <div className="h-64 overflow-y-auto mb-3 border rounded p-2 bg-gray-50">
                <p className="text-sm text-gray-500 my-2">Начните обсуждение...</p>
              </div>
              <input
                type="text"
                placeholder="Введите сообщение..."
                className="w-full p-2 border rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setChatMessages([
                      ...chatMessages,
                      { from: 'me', text: e.target.value },
                      { from: 'executor', text: 'Я получил ваше сообщение!' }
                    ]);
                    e.target.value = '';
                  }
                }}
              />
              <div className="flex justify-end mt-2">
                <button onClick={() => setShowChat(false)} className="text-gray-500">Закрыть</button>
              </div>
            </div>
          </div>
        )}

        {/* Chatbot */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => alert("Привет! Я бот ProРемонт. Чем могу помочь?")}
            className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
          >
            🤖
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 mt-12 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; 2025 ProРемонт — Все права защищены.
        </div>
      </footer>
    </div>
  );
}