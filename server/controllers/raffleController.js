import Raffle from '../models/Raffle.js';
import {User} from '../models/Users.js'
import sanitizeRaffle from '../utils/sanitizeRaffle.js';
import { raffleValidationSchema } from '../validators/raffleSchema.js';
import { ticketInfoValidationSchema } from '../validators/ticketInfoSchemaValidate.js';
import setUserForClient from '../functions/userClient.js';
import { RaffleCounter } from '../models/RaffleCounter.js';
import AppError from '../utils/AppError.js';
import { v2 as cloudinary } from 'cloudinary';
import plans from "../seed/plans.js"
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,       // your email address
      pass: process.env.EMAIL_PASS        // your email password or app password
    }
});



export const createRaffle = async(req, res)=>{
      const images = req.files?.map(file => ({url: file.path, public_id: file.filename})); 
      const parsedBody = {
        ...req.body,
        images,
        logo_display_name: JSON.parse(req.body.logo_display_name || 'true'),
        textHtml: JSON.parse(req.body.textHtml || '{}'),
        colorPalette: JSON.parse(req.body.colorPalette || '{}'),
        paymentMethods: JSON.parse(req.body.paymentMethods || '[]'),
        additionalPrizes: JSON.parse(req.body.additionalPrizes || '[]'),
      };
      const {error, value} = raffleValidationSchema.validate({...parsedBody})
      if(error){
        res.json({message: error.details, status: 400})
        return;
      }
      
      const raffle = await Raffle.create({...value, isActive: true})
      const userNew = await User.findByIdAndUpdate(req.user._id, { $push: { raffles: raffle._id } }, { new: true } );
      if(userNew && raffle){
        const clientUser = await setUserForClient(req, userNew)
        res.json({message: "Raffle created", link: raffle.shortId, status: 200, user: {...clientUser}})
      } else {
        res.json({message: "User not found", status: 400})
      }
  }
  export const deleteRaffle = async(req, res)=>{
      const {id} = req.params;
      const deleteRaffle = await Raffle.findByIdAndDelete(id)
      const images = deleteRaffle.images
      if(images){
        for (const {public_id} of images) {
          await cloudinary.uploader.destroy(public_id);
        }
      }
      const user = await User.findOneAndUpdate(
        { raffles: id }, 
        { $pull: { raffles: id } }, 
        { new: true }
      );
      if(user && deleteRaffle){
        const clientUser = await setUserForClient(req, user)
        res.json({message: "Raffle deleted", status: 200, user: clientUser})
      } else {
        res.json({message: "User not found", status: 400})
      }
  }

export const editRaffle = async (req, res) => {
  const { id } = req.params;
  const { oldPublicIds, ...restBody } = req.body;
  const parsedOldIds = req.body.oldPublicIds ? JSON.parse(req.body.oldPublicIds) : []
  let uploadedImages = [];
  if(req.files && req.files.length > 0){
    if(parsedOldIds && parsedOldIds.length > 0){
      for (const {url, public_id} of parsedOldIds) {
        await cloudinary.uploader.destroy(public_id);
      }
    }
    uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));
  }
    const newRaffle = {
      ...restBody,
      logo_display_name: JSON.parse(req.body.logo_display_name || 'true'),
      textHtml: JSON.parse(req.body.textHtml || '{}'),
      colorPalette: JSON.parse(req.body.colorPalette || '{}'),
      additionalPrizes: req.body.additionalPrizes ? JSON.parse(req.body.additionalPrizes) : [],
      paymentMethods: req.body.paymentMethods ? JSON.parse(req.body.paymentMethods) : [],
      images: uploadedImages.length > 0 ? uploadedImages : parsedOldIds,
    };

    const { error, value } = raffleValidationSchema.validate(newRaffle);
    if (error) {
      return res.json({ message: error.details, status: 400 });
    }
    const user = await User.findById(req.user._id)
    
    const updatedRaffle = await Raffle.findByIdAndUpdate(id, { $set: value }, { new: true });
    if (updatedRaffle) {
      const clientUser = await setUserForClient(req, user)
      return res.json({ message: 'Raffle edited', status: 200, user: clientUser });
    } else {
      return res.json({ message: 'Error updating raffle', status: 400 });
    }
};

  export const findRaffle = async (req, res)=>{
    const raffleID = req.params.id
      try {
      const raffle = await Raffle.findOne({ shortId: raffleID }).lean();
      if(raffle){
        const user = await User.findOne({ raffles: raffle._id });
        if(raffle.isActive){
          const cleanRaffle = sanitizeRaffle(raffle)
          const unavailableTickets = raffle.currentParticipants.flatMap(part => part.tickets.map(t => t.number));
          const availableTickets = []
          for (let i = 1; i < raffle.maxParticipants + 1; i++) {
            if(!unavailableTickets.includes(i)){
              availableTickets.push(i)
            }
          }
          res.json({message: "Raffle found", status: 200, raffle: {...cleanRaffle, availableTickets: availableTickets, logo: user.logo, phone: user.phone, facebookUrl: user.facebookUrl, verified: user.verified, email: user.username, business_name: user.companyName}})
        } else {
          return res.json({message: "raffle inactive"})
        }
      } else {
        return res.json({message: "raffle not found", status: 404})
      }
    } catch (error) {
        console.log(error)
    }
  }
  // export const contactRaffle = async (req, res)=>{
  //   const raffleID = req.params.id
  //   const contactData = req.body
  //   const {error, value} = contactValidationSchema.validate(contactData)
  //   if(error){
  //     return res.json({message: error.details, status: 400})
  //   }
  //   await Raffle.updateOne(
  //     { shortId: raffleID },
  //     { $push: { contact: value } }
  //   );
  //   res.json({message: "Contact Sent", status: 200})
  // }

  function getNextTransactionId(currentParticipants){
    const transactionNumber = currentParticipants.length > 0 ? Number(currentParticipants[currentParticipants.length - 1].transactionID) + 1 : 1;
    const transactionID = String(transactionNumber).padStart(3, '0');
    return transactionID
  }


  export const paymentRaffle = async (req, res)=>{
    const raffleID = req.params.id
    const raffle = await Raffle.findOne({ shortId: raffleID });
    const currentParticipants = raffle.currentParticipants;
    const now = new Date();
    const endDate = new Date(raffle.endDate);
    if(now > endDate){
      return res.json({message: "raffle has finalized", status: 400});
    }
    const body = req.body
    let ticketExists = false
    currentParticipants.forEach(participant => {
      for (const number of body.tickets) {
        if(participant.tickets.map(t => t.number).includes(number)){
          ticketExists = true
        }
      }
      
    })
    if(ticketExists) return res.json({message: "ticket exists", status: 400});
    const transactionId = getNextTransactionId(currentParticipants);
    const amount = raffle.price * body.tickets.length
    const newBody = {
      ...body,
      tickets: body.tickets.map(t => ({
        number: t
      })),
      transactionID: transactionId,
      amount: amount
    }
    const {error, value} = ticketInfoValidationSchema.validate(newBody)
    if(error){
      return res.json({message: error.details, status: 400})
    }
    raffle.currentParticipants.push(value)
    raffle.notifications.push({
      category: "sale",
      message: `Transacción #${value.transactionID}`,
      time: new Date()
    })
    await updateStats(raffle, "dailySales", amount);
    await raffle.save()
    const user = await User.findOne({ raffles: raffle._id });
    await transporter.sendMail({
      to: user.username,
      subject: '¡Tu boleto ha sido vendido!',
      html: `<p>¡Felicidades! Se ha hecho una transaccion <strong>${transactionId}</strong> a nombre de <strong>${value.first_name + ' ' + value.last_name}</strong>.</p>
      <p>Gracias por usar nuestra plataforma. Puedes ver los detalles en tu cuenta.</p>`
    });
    res.json({message: "Contact Sent", status: 200})
  }
  export const editFindRaffle = async (req, res)=>{
      const raffleID = req.params.id
      const raffle = await Raffle.findById(raffleID);
      const cleanRaffle = sanitizeRaffle(raffle.toObject())
      if(raffle){
        res.json({message: "Raffle found", status: 200, raffle: {...cleanRaffle}, shortId: raffle.shortId})
      } else {
        res.json({message: "Raffle not found", status: 200})
      }
    }
  export const updateTicket = async (req, res)=>{
      const { id, ticketNumber } = req.params
      const { updates } = req.body
      const numberTicket = Number(ticketNumber)
      const raffle = await Raffle.findById(id);
      raffle.currentParticipants = raffle.currentParticipants.map(participant => {
        let foundTicket = false
        for (const { number } of participant.tickets) {
            if(number === numberTicket){
              foundTicket = true
            }
        }
        if(foundTicket){
          return {...participant, tickets: participant.tickets.map(ticket => ticket.number === numberTicket ? {...ticket, ...updates} : ticket)}
        } else {
          return participant
        }
      })

      await raffle.save();
      const user = await User.findById(req.user._id)
      const clientUser = await setUserForClient(req, user)

      res.json({message: "Updated", status: 200, user: clientUser})

  }

  export const deleteTicket = async(req, res) => {
    const {id, ticketNumber} = req.params
    const raffle = await Raffle.findById(id);
    if (!raffle) return res.status(404).json({ message: "Raffle not found" });

    let ticketFound = false;

    raffle.currentParticipants = raffle.currentParticipants.map(participant => {
      const originalLength = participant.tickets.length;

      participant.tickets = participant.tickets.filter(
        ticket => ticket.number.toString() !== ticketNumber
      );

      if (participant.tickets.length < originalLength) {
        ticketFound = true;
      }

      return participant;
    }).filter(participant => participant.tickets.length > 0);;

    if (!ticketFound) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await raffle.save();
    const user = await User.findById(req.user._id)
    const clientUser = await setUserForClient(req, user)

    res.json({message: "Deleted", status: 200, user: clientUser})

  }
  export const updateTicketsById = async (req, res)=>{
    const { id, ticketId } = req.params
    const raffle = await Raffle.findById(id);
    console.log(id, ticketId)
    raffle.currentParticipants = raffle.currentParticipants.map(participant => {
      if(participant._id.toString() === ticketId){
        return {...participant, tickets: participant.tickets.map(ticket => ({...ticket, status: "pagado"}))}
      } else {
        return participant
      }
    })


    await raffle.save();
    const user = await User.findById(req.user._id)
    const clientUser = await setUserForClient(req, user)

    res.json({message: "Updated All", status: 200, user: clientUser})
  }
  export const viewNotification = async (req, res)=>{
    const {id, notificationid} = req.params
    const raffle = await Raffle.findById(id);
    const notification = raffle.notifications.id(notificationid)
    if(!notification?.read){
      notification.read = true
      await raffle.save();
      res.json({message: "marked as read", status: 200})
    } else {
      res.json({message: "already read", status: 200})
    }
  }
  
  export const viewUpdateRaffle = async (req, res) => {
    const { id } = req.params
    const raffle = await Raffle.findOne({ shortId: id });
    if(raffle){
      await updateStats(raffle, "dailyVisitStats", 1);
      res.json({message: "view updated"})
    }
  }

  export const verifyRaffle = async (req, res) => {
    const { id } = req.params
    const { query } = req.body
    const raffle = await Raffle.findOne({ shortId: id });
    const ticket = searchTicket(raffle.currentParticipants, query);
    if(ticket){
      res.json({message: "ticket found", status: 200, ticket})
    } else {
      res.json({message: "ticket not found", status: 400})
    }
  }


  const searchTicket = (participants, query) => {
    const lowerQuery = query.toLowerCase()
    let ticket = undefined
    let found = false
    participants.forEach(participant => {
      if(!found){
          if(participant.phone.toString() === lowerQuery){
            found = true;
          } else if (participant.transactionID.toLowerCase() === lowerQuery) {
            found = true;
          } else {
            const ticketNum = participant.tickets.find(ticket => ticket.toString() === lowerQuery)
            if(ticketNum){
              found = true;
            }
          }
        if(found){
          ticket = participant
        }
      }
      
    });
    return ticket
  }




  async function updateStats(raffle, type, amount) {
    const currentDate = new Date();
    const [isoDateShort, time] = currentDate.toISOString().split('T');
    const hour = time.split(":")[0].padStart(2, '0') + ':00';
  
    const statArray = raffle.stats[type] || [];
  
    let dayEntry = statArray.find(entry => entry.date === isoDateShort);
  
    if (!dayEntry) {
      dayEntry = {
        date: isoDateShort,
        count: amount,
        time: [{ hour, count: amount }],
      };
      statArray.push(dayEntry);
    } else {
      dayEntry.count += amount;
  
      const hourEntry = dayEntry.time.find(t => t.hour === hour);
  
      if (hourEntry) {
        hourEntry.count += amount;
      } else {
        dayEntry.time.push({ hour, count: amount });
      }
    }
    await Raffle.updateOne(
      { _id: raffle._id },
      {
        $set: {
          [`stats.${type}`]: statArray
        }
      }
    );
  }
  




  