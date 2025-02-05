export const mockData = {
    movies: [
        {
            id: 1,
            title: 'The Matrix Resurrections',
            showTimes: ['10:00', '13:00', '16:00', '19:00'],
            pricing: {
                regular: 12.99,
                premium: 16.99,
                vip: 24.99
            },
            seatTypes: {
                regular: 'Standard Seating',
                premium: 'Premium Seating with Extra Legroom',
                vip: 'VIP Recliner with Food Service'
            },
            price: 12.99 // base price
        },
        {
            id: 2,
            title: 'Dune',
            showTimes: ['11:00', '14:00', '17:00', '20:00'],
            pricing: {
                regular: 14.99,
                premium: 18.99,
                vip: 26.99
            },
            seatTypes: {
                regular: 'Standard Seating',
                premium: 'Premium Seating with Extra Legroom',
                vip: 'VIP Recliner with Food Service'
            },
            price: 14.99 // base price
        },
        {
            id: 3,
            title: 'Inception',
            showTimes: ['12:00', '15:00', '18:00', '21:00'],
            pricing: {
                regular: 13.99,
                premium: 17.99,
                vip: 25.99
            },
            seatTypes: {
                regular: 'Standard Seating',
                premium: 'Premium Seating with Extra Legroom',
                vip: 'VIP Recliner with Food Service'
            },
            price: 13.99 // base price
        }
    ],
    events: [
        {
            id: 1,
            title: 'Rock Concert',
            date: '2024-02-15',
            time: '20:00',
            pricing: {
                general: 49.99,
                premium: 79.99,
                vip: 149.99
            },
            seatTypes: {
                general: 'General Admission',
                premium: 'Premium Section with Better View',
                vip: 'VIP Section with Meet & Greet'
            },
            price: 49.99 // base price
        },
        {
            id: 2,
            title: 'Comedy Show',
            date: '2024-02-20',
            time: '19:00',
            pricing: {
                general: 29.99,
                premium: 49.99,
                vip: 89.99
            },
            seatTypes: {
                general: 'General Seating',
                premium: 'Premium Seating - Front Section',
                vip: 'VIP Package with Backstage Pass'
            },
            price: 29.99 // base price
        },
        {
            id: 3,
            title: 'Tech Conference',
            date: '2024-03-01',
            time: '09:00',
            pricing: {
                standard: 199.99,
                professional: 299.99,
                enterprise: 499.99
            },
            seatTypes: {
                standard: 'Standard Access - All Sessions',
                professional: 'Pro Access - Including Workshops',
                enterprise: 'Enterprise - Private Networking Events'
            },
            price: 199.99 // base price
        }
    ],
    travel: [
        {
            id: 1,
            destination: 'Paris',
            dates: ['2024-02-15', '2024-02-20', '2024-02-25'],
            pricing: {
                economy: 299.99,
                business: 599.99,
                firstClass: 999.99
            },
            seatTypes: {
                economy: 'Economy Class',
                business: 'Business Class with Lounge Access',
                firstClass: 'First Class with Premium Services'
            },
            price: 299.99 // base price
        },
        {
            id: 2,
            destination: 'Tokyo',
            dates: ['2024-03-01', '2024-03-05', '2024-03-10'],
            pricing: {
                economy: 499.99,
                business: 899.99,
                firstClass: 1499.99
            },
            seatTypes: {
                economy: 'Economy Class',
                business: 'Business Class with Lounge Access',
                firstClass: 'First Class with Premium Services'
            },
            price: 499.99 // base price
        },
        {
            id: 3,
            destination: 'New York',
            dates: ['2024-02-18', '2024-02-23', '2024-02-28'],
            pricing: {
                economy: 399.99,
                business: 799.99,
                firstClass: 1299.99
            },
            seatTypes: {
                economy: 'Economy Class',
                business: 'Business Class with Lounge Access',
                firstClass: 'First Class with Premium Services'
            },
            price: 399.99 // base price
        }
    ]
};

export const getMockResponse = (category, query) => {
    if (!mockData[category]) {
        return null;
    }

    return mockData[category].filter(item => 
        Object.values(item).some(value => 
            String(value).toLowerCase().includes(query.toLowerCase())
        )
    );
};
