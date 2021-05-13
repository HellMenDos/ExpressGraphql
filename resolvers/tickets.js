const Ticket = require('../models/ticket')
const TicketMessages = require('../models/ticket-messages')

module.exports = {
    async getAll() {
        const arr = await Ticket.findAll({where: {uid: global.user.id}, order: [['status', 'ASC'], ['id', 'DESC']]})
        return arr
    },
    async getOne({tid}) {
        const ticket = await Ticket.findOne({where: {uid: global.user.id, id: tid}})
        return ticket
    },
    async addMessage({tid, message}) {
        const ticket = await this.getOne({tid})
        if (!ticket) {
            throw new Error('Ticket_not_exists')
        }
        ticket.status=0
        await ticket.save()

        const msg = new TicketMessages({tid, uid: global.user.id, message, date: Date.now()})

        await msg.save()

        return msg
    },
    async addTicket({name, message}) {
        const ticket = new Ticket({uid: global.user.id, name, date: Date.now()})
        await ticket.save()

        await this.addMessage({tid: ticket.id, message})

        return ticket
    },
    async getMessages({tid}) {
        const messages = await TicketMessages.findAll({where: {uid: global.user.id, tid}, order: [['id', 'ASC']]})

        const ticket = await getOne(tid)
        if (ticket.new) {
            const user = User.findOne({where: {id: global.user.id}})
            user.help -= ticket.new
            await user.save()

            ticket.new = 0
            await ticket.save()


        }

        return messages
    },
    async changeStatus({tid}) {
        const ticket = await Ticket.findOne({where: {uid: global.user.id, id: tid}})
        const newStatus = ticket.status == 0 ? 1 : 0
        ticket.status = newStatus
        await ticket.save()
        return ticket
    }
}
