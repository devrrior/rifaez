


import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8); // only digits


const RaffleSchema = new mongoose.Schema({
    shortId: {
        type: String,
        unique: true,
      },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                default: '',
            },
            price: {
                type: Number,
                required: true
            },
            endDate: {
                type: Date,
                default: () => {
                    const now = new Date();
                    now.setDate(now.getDate() + 30);
                    now.setHours(23, 59, 59, 999); 
                    return now;
                  }                
            },
            maxParticipants: {
                type: Number,
                required: true
            },
            currentParticipants: {
                type: [{
                    first_name: {
                        type: String
                    },
                    last_name: {
                        type: String
                    },
                    phone: {
                        type: {
                            number: String,
                            country: String,
                        }
                    },
                    state: {
                        type: String
                    },
                    date: {
                        type: String
                    },
                    tickets: {
                        type: [{
                            number: Number,
                            status: {
                                type: String,
                                default: "pending"
                            },
                            notes: {
                                type: String,
                                default: ""
                            }
                        }]
                    },
                    amount: {
                        type: Number
                    },
                    transactionID: {
                        type: String,
                    },
                }],
                required: true,
                default: []
            },
            isActive: {
                type: Boolean,
                required: true
            },
            paymentMethods: {
                type: [{
                  bank: String,
                  person: String, 
                  number: String,
                  clabe: String,
                  instructions: String,
                }],
                default: [],
              },
            additionalPrizes: {
                type: [{
                    place: Number,
                    prize: String
                }],
                default: []
            },
            textHtml: {
                type: {
                    title: {
                        type: String,
                        default: "Preguntas Frecuentes"
                    },
                    html: String
                },
                required: true,
            },
            colorPalette: {
                type: {
                    header: String,
                    background: String,
                    accent: String,
                    borders: String,
                    color: String,
                },
                required: true,
            },
            logo_position: {
                type: String,
                default: "center"
            },
            logo_display_name: {
                type: Boolean,
                default: true,
            },
            logo_size: {
                type: String,
                default: "md",
            },
            logo_type: {
                type: String,
                default: "on",
            },
            border_corner: {
                type: String,
                default: "square",
            },
            purchasedTicketDisplay: {
                type: String,
                default: "cross",
            },
            countdown: {
                type: String,
                default: "off"
            },
            font: {
                type: String,
            },

            // nightMode: {
            //     type: Boolean,
            //     default: false
            // },
            // maxTpT: {
            //     type: Number,
            //     default: 10
            // },
            timeLimitPay: {
                type: Number,
                min: 1,
                default: 3
            },
            images: {
                type: [{
                    url: String,
                    public_id: String
                }],
                default: []
            },
            extraInfo: {
                type: String,
            },
            contact: {
                type: [{
                    name: String,
                    email: String,
                    message: String,
                    date: String
                }],
                default: []
            },
            stats: {
                dailyVisitStats: {
                    type: [
                        {
                            date: {
                                type: String,
                                unique: true
                            }, // e.g., '2024-05-02'
                            count: Number,
                            time: {
                                type: [{
                                    hour: { type: String, required: true, unique: true }, // e.g., "19:00"
                                    count: { type: Number, required: true }
                                  }],
                                default: []
                            },
                        }
                    ],
                    default: []
                },
                dailySales: {
                    type: [
                        {
                            date: {
                                type: String,
                                unique: true
                            }, // e.g., '2024-05-02'
                            count: Number,
                            time: {
                                type: [{
                                    hour: { type: String, required: true, unique: true }, // e.g., "19:00"
                                    count: { type: Number, required: true }
                                  }],
                                default: []
                            },
                        }
                    ],
                    default: []
                },
                paidParticipants: { type: Number, default: 0 }
            },
            notifications: {
                type: [{
                    category: String,
                    read: {
                        type: Boolean, 
                        default: false,
                    },
                    message: String,
                    time: { type: Date, default: Date.now },
                }],
                default: []
            }
        }
)

RaffleSchema.pre('save', function (next) {
    const raffle = this;
  
    let paidCount = 0;
    
    raffle.currentParticipants.forEach(participant => {
      participant.tickets.forEach(ticket => {
        if (ticket.status === 'pagado') {
          paidCount++;
        }
      });
    });
  
    raffle.stats.paidParticipants = paidCount;
  
    next();
  });

RaffleSchema.virtual('totalVisits').get(function () {
    return this.stats?.dailyVisitStats?.reduce((sum, visit) => sum + visit?.count, 0) || 0;
  });

  const calcTimeAgo = (notifyDate) => {
    const getToday = new Date();
    const notificationDate = new Date(notifyDate);
    const diffInMs = getToday - notificationDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `Hace ${diffInDays} días`;
    } else if (diffInHours > 0) {
        return `Hace ${diffInHours} horas`;
    } else if (diffInMinutes > 0) {
        return `Hace ${diffInMinutes} minutos`;
    } else if (diffInSeconds > 0) {
        return `Hace ${diffInSeconds} segundos`;
    } else {
        return "Justo ahora";
    }
};


RaffleSchema.pre('save', function (next) {
    if (this.isNew && !this.shortId) {
      this.shortId = nanoid();
    }
    next();
  });

RaffleSchema.virtual('totalSales').get(function () {
    return this.stats.dailySales.reduce((sum, sale) => sum + sale.count, 0);
  });
RaffleSchema.virtual('readableEndDate').get(function () {
    const humanReadableDate = this.endDate.toLocaleString(); 
    return humanReadableDate
});
RaffleSchema.virtual('totalRevenue').get(function () {
    const totalRevenue = this.price * this.maxParticipants;
    return totalRevenue
});
RaffleSchema.set('toJSON', {
virtuals: true 
});
RaffleSchema.set('toObject', {
    virtuals: true 
});

export default mongoose.model('Raffle', RaffleSchema);


