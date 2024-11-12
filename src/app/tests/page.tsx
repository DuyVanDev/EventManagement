"use client"
import React, { useState } from 'react';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // Default tab is 'upcoming'

  const eventsUpcoming = [
    {
      id: 1,
      imageUrl: 'image_link_upcoming1',
      altText: 'Upcoming Event 1',
      category: 'Category 1',
      title: 'Upcoming Event 1',
      time: '18:00 - 20:00, 25/10/2024',
      description: 'This is an upcoming event description.',
      buttons: [{ icon: 'fas fa-sign-in-alt', text: 'Tham gia' }],
    },
    {
      id: 2,
      imageUrl: 'image_link_upcoming2',
      altText: 'Upcoming Event 2',
      category: 'Category 2',
      title: 'Upcoming Event 2',
      time: '15:00 - 17:00, 28/10/2024',
      description: 'Another upcoming event description.',
      buttons: [{ icon: 'fas fa-sign-in-alt', text: 'Tham gia' }],
    },
  ];

  const eventsRegistered = [
    {
      id: 1,
      imageUrl: 'image_link_registered1',
      altText: 'Registered Event 1',
      category: 'Category 1',
      title: 'Registered Event 1',
      time: '13:00 - 15:00, 20/10/2024',
      description: 'This is a registered event description.',
      buttons: [{ icon: 'fas fa-check-circle', text: 'Đã đăng ký' }],
    },
    {
      id: 2,
      imageUrl: 'image_link_registered2',
      altText: 'Registered Event 2',
      category: 'Category 2',
      title: 'Registered Event 2',
      time: '10:00 - 12:00, 22/10/2024',
      description: 'Another registered event description.',
      buttons: [{ icon: 'fas fa-check-circle', text: 'Đã đăng ký' }],
    },
  ];
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Danh sách sự kiện</h1>
      
      {/* Tab Menu */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-6 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Sự kiện sắp diễn ra
        </button>
        <button
          className={`py-2 px-6 ${activeTab === 'registered' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('registered')}
        >
          Sự kiện đã đăng ký
        </button>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventsUpcoming.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex">
                  <img className="w-1/3 rounded-lg" src={item.imageUrl} alt={item.altText} />
                  <div className="ml-6 w-2/3">
                    <p className="text-gray-500 mb-2">{item.category}</p>
                    <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                    <p className="text-gray-700 mb-2">Thời gian: {item.time}</p>
                    <p className="text-gray-700 mb-4">{item.description}</p>
                    <div className="flex space-x-4">
                      {item.buttons.map((button, index) => (
                        <button key={index} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                          <i className={`${button.icon} mr-2`}></i>
                          {button.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'registered' && (
          <div className="grid grid-cols-1  gap-6">
            {eventsRegistered.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex">
                  <img className="w-1/3 rounded-lg" src={item.imageUrl} alt={item.altText} />
                  <div className="ml-6 w-2/3">
                    <p className="text-gray-500 mb-2">{item.category}</p>
                    <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                    <p className="text-gray-700 mb-2">Thời gian: {item.time}</p>
                    <p className="text-gray-700 mb-4">{item.description}</p>
                    <div className="flex space-x-4">
                      {item.buttons.map((button, index) => (
                        <button key={index} className="flex items-center bg-gray-400 text-white px-4 py-2 rounded-lg cursor-default">
                          <i className={`${button.icon} mr-2`}></i>
                          {button.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

