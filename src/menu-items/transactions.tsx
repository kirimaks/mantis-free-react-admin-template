import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';


const transactions = {
    id: 'transactions',
    title: 'Transactions',
    type: 'group',
    children: [
        {
            id: 'transactions',
            title: 'Transactions',
            type: 'item',
            url: '/transactions',
            icon: ChromeOutlined,
        },
        {
            id: 'tags',
            title: 'Tags',
            type: 'item',
            url: '/tags',
            icon: ChromeOutlined
        }
    ]
};

export default transactions;
