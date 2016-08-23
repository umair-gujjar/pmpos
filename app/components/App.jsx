import React from 'react';
import uuid from 'uuid';
import Header from './Header';
import Categories from './Categories';
import MenuItems from './MenuItems';
import Orders from './Orders';
import TicketTotal from './TicketTotal';
import Signalr from '../signalr';
import {getCategories, getMenuItems,addOrderToTicket} from '../queries';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [
                {
                    id: 1,
                    name: 'Loading...'
                }
            ],
            selectedCategory: '',
            menuItems: [
                { id: 1, name: 'Loading...' }
            ],
            ticket: {
                id: 10,
                uid: 'CyB2Fj__vkO1wePOCG9kjQ',
                type: 'Ticket',
                date: '2016-08-23T18:51:35',
                department: 'Restaurant',
                user: 'Administrator',
                terminal: 'Server',
                number: 'A0001',
                totalAmount: 9,
                remainingAmount: 9,
                note: '',
                entities: [],
                states: [],
                tags: [],
                calculations: [],
                orders: [
                    {
                        name: 'Tea',
                        id: 11,
                        uid: 'errq0C54fkSvfdVrX2X8Og',
                        quantity: 3,
                        price: 1,
                        calculatePrice: false,
                        decreaseInventory: true,
                        increaseInventory: false,
                        states: [
                            { stateName: 'Status', state: 'Submitted', stateValue: '' },
                            { stateName: 'GStatus', state: 'Gift', stateValue: '' }
                        ],
                        tags: []
                    }
                ]
            }
        }
    }

    componentDidMount() {
        Signalr.connect(() => {
            this.refreshCategories();
        });
        this.refreshCategories();
    }

    refreshCategories() {
        getCategories((categories) => {
            this.setState({ categories: categories });
            if (categories[0])
                this.onCategoryClick(categories[0].name);
        })
    }

    refreshMenuItems(category) {
        getMenuItems(category, (items) => {
            this.setState({ menuItems: items });
        })
    }

    render() {
        const {categories, selectedCategory, menuItems, ticket} = this.state;
        return (
            <div className="mainDiv">
                <Header header={this.state.ticket.entityName}/>
                <Categories categories={categories}
                    selectedCategory={selectedCategory}
                    onClick={this.onCategoryClick}/>
                <MenuItems menuItems={menuItems}
                    onClick={this.onMenuItemClick}/>
                <Orders ticket={ticket}/>
                <TicketTotal ticket={ticket}/>
            </div>
        );
    }

    onCategoryClick = (category) => {
        this.setState({ selectedCategory: category });
        this.refreshMenuItems(category);
    }

    onMenuItemClick = (menuItem) => {
        addOrderToTicket(this.state.ticket,menuItem,1,(ticket)=>{
            this.setState({ ticket: ticket });
        });
    }
}