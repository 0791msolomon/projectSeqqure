const mongodb = require("../mongodb.connection");
const connection = mongodb.connection;
const ObjectId = mongodb.ObjectId;

module.exports = {
  readAll: readAll,
  readById: readById,
  create: create,
  update: update,
  deleteEscrow: deleteEscrow,
  search: search,
  itemCount: itemCount
};

function itemCount(role, tenant, userId) {
  if (role === "5af77a322b3f750498fe6d0c") {
    return connection
      .db()
      .collection("escrow")
      .aggregate([{ $match: { tenantId: new ObjectId(tenant) } }])
      .toArray()
      .then(response => {
        for (let i = 0; i < response.length; i++) {
          let item = response[i];
          item._id = item._id.toString();
        }
        return response;
      });
  } else {
    return connection
      .db()
      .collection("escrow")
      .aggregate([
        {
          $match: {
            $and: [
              { tenantId: new ObjectId(tenant) },
              { "people.person._id": userId }
            ]
          }
        }
      ])
      .toArray()
      .then(response => {
        for (let i = 0; i < response.length; i++) {
          let item = response[i];
          item._id = item._id.toString();
        }
        return response;
      });
  }
}
function search(
  currentPage,
  itemsListed,
  userId,
  tenantId,
  role,
  address,
  seller,
  buyer,
  openDate,
  closeDate,
  openDateEnd,
  closeDateStart
) {
  if (role === "5af77a322b3f750498fe6d0c") {
    return connection
      .db()
      .collection("escrow")
      .aggregate([
        { $addFields: { buyer: buyer, seller, seller } },
        {
          $match: {
            $and: [
              { tenantId: new ObjectId(tenantId) },
              {
                $or: [
                  {
                    $and: [
                      {
                        people: {
                          $elemMatch: {
                            "person.firstName": new RegExp(buyer, "i"),
                            "securityRole.name": "Buyer"
                          }
                        }
                      },
                      { seller: "xzxzxz" }
                    ]
                  },
                  {
                    $and: [
                      {
                        people: {
                          $elemMatch: {
                            "person.lastName": new RegExp(buyer, "i"),
                            "securityRole.name": "Buyer"
                          }
                        }
                      },
                      { seller: "xzxzxz" }
                    ]
                  },
                  {
                    $and: [
                      {
                        people: {
                          $elemMatch: {
                            "person.firstName": new RegExp(seller, "i"),
                            "securityRole.name": "Seller"
                          }
                        }
                      },
                      { buyer: "xzxzxz" }
                    ]
                  },
                  {
                    $and: [
                      {
                        people: {
                          $elemMatch: {
                            "person.lastName": new RegExp(seller, "i"),
                            "securityRole.name": "Seller"
                          }
                        }
                      },
                      { buyer: "xzxzxz" }
                    ]
                  },
                  {
                    $and: [
                      {
                        $or: [
                          {
                            people: {
                              $elemMatch: {
                                "person.firstName": new RegExp(seller, "i"),
                                "securityRole.name": "Seller"
                              }
                            }
                          },
                          {
                            people: {
                              $elemMatch: {
                                "person.lastName": new RegExp(seller, "i"),
                                "securityRole.name": "Seller"
                              }
                            }
                          }
                        ]
                      },
                      {
                        $or: [
                          {
                            people: {
                              $elemMatch: {
                                "person.firstName": new RegExp(buyer, "i"),
                                "securityRole.name": "Buyer"
                              }
                            }
                          },
                          {
                            people: {
                              $elemMatch: {
                                "person.lastName": new RegExp(buyer, "i"),
                                "securityRole.name": "Buyer"
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    $and: [
                      { people: { $exists: true } },
                      { buyer: { $eq: "" } },
                      { seller: { $eq: "" } }
                    ]
                  }
                ]
              },
              {
                $or: [
                  { street: new RegExp(address, "i") },
                  { suite: new RegExp(address, "i") },
                  { city: new RegExp(address, "i") },
                  { state: new RegExp(address, "i") },
                  { zip: new RegExp(address, "i") }
                ]
              },
              { openDate: { $gte: openDate } },
              { expectedCloseDate: { $gte: closeDateStart } },
              {
                $or: [
                  { expectedCloseDate: { $lte: closeDate } },
                  { expectedCloseDate: new RegExp(closeDate, "i") }
                ]
              },
              {
                $or: [
                  { openDate: { $lte: openDateEnd } },
                  { openDate: new RegExp(openDateEnd, "i") }
                ]
              }
            ]
          }
        },
        {
          $group: {
            _id: "$_id",
            street: { $first: "$street" },
            suite: { $first: "$suite" },
            city: { $first: "$city" },
            state: { $first: "$state" },
            zip: { $first: "$zip" },
            escrowNumber: { $first: "$escrowNumber" },
            openDate: { $first: "$openDate" },
            finalDate: { $first: "$finalDate" },
            expectedCloseDate: { $first: "$expectedCloseDate" },
            parcelNumber: { $first: "$parcelNumber" },
            transactionType: { $first: "$transactionType" },
            people: { $first: "$people" },
            tenantId: { $first: "$tenantId" },
            escrowStatus: { $first: "$escrowStatus" }
          }
        },
        { $sort: { expectedCloseDate: 1 } },
        { $skip: (currentPage - 1) * itemsListed },
        { $limit: itemsListed }
      ])
      .toArray()
      .then(response => {
        for (let i = 0; i < response.length; i++) {
          let item = response[i];
          item._id = item._id.toString();
        }
        return response;
      });
  } else {
    return connection
      .db()
      .collection("escrow")
      .aggregate([
        { $addFields: { buyer: buyer, seller, seller } },
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    $and: [
                      { tenantId: new ObjectId(tenantId) },
                      {
                        $or: [
                          { "people.person._id": userId },
                          { "people.person._id": ObjectId(userId) }
                        ]
                      }
                    ]
                  }
                ]
              },

              {
                $or: [
                  {
                    $and: [
                      {
                        people: {
                          $elemMatch: {
                            "person.firstName": new RegExp(buyer, "i"),
                            "securityRole.name": "Buyer"
                          }
                        }
                      },
                      { seller: "xzxzxz" }
                    ]
                  },
                  {
                    $and: [
                      {
                        people: {
                          $elemMatch: {
                            "person.lastName": new RegExp(buyer, "i"),
                            "securityRole.name": "Buyer"
                          }
                        }
                      },
                      { seller: "xzxzxz" }
                    ]
                  },
                  {
                    $and: [
                      {
                        people: {
                          $elemMatch: {
                            "person.firstName": new RegExp(seller, "i"),
                            "securityRole.name": "Seller"
                          }
                        }
                      },
                      { buyer: "xzxzxz" }
                    ]
                  },
                  {
                    $and: [
                      {
                        people: {
                          $elemMatch: {
                            "person.lastName": new RegExp(seller, "i"),
                            "securityRole.name": "Seller"
                          }
                        }
                      },
                      { buyer: "xzxzxz" }
                    ]
                  },
                  {
                    $and: [
                      {
                        $or: [
                          {
                            people: {
                              $elemMatch: {
                                "person.firstName": new RegExp(seller, "i"),
                                "securityRole.name": "Seller"
                              }
                            }
                          },
                          {
                            people: {
                              $elemMatch: {
                                "person.lastName": new RegExp(seller, "i"),
                                "securityRole.name": "Seller"
                              }
                            }
                          }
                        ]
                      },
                      {
                        $or: [
                          {
                            people: {
                              $elemMatch: {
                                "person.firstName": new RegExp(buyer, "i"),
                                "securityRole.name": "Buyer"
                              }
                            }
                          },
                          {
                            people: {
                              $elemMatch: {
                                "person.lastName": new RegExp(buyer, "i"),
                                "securityRole.name": "Buyer"
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    $and: [
                      { people: { $exists: true } },
                      { buyer: { $eq: "" } },
                      { seller: { $eq: "" } }
                    ]
                  }
                ]
              },
              {
                $or: [
                  { street: new RegExp(address, "i") },
                  { suite: new RegExp(address, "i") },
                  { city: new RegExp(address, "i") },
                  { state: new RegExp(address, "i") },
                  { zip: new RegExp(address, "i") }
                ]
              },
              { openDate: { $gte: openDate } },
              { finalDate: { $gte: closeDateStart } },
              {
                $or: [
                  { finalDate: { $lte: closeDate } },
                  { finalDate: new RegExp(closeDate, "i") }
                ]
              },
              {
                $or: [
                  { openDate: { $lte: openDateEnd } },
                  { openDate: new RegExp(openDateEnd, "i") }
                ]
              }
            ]
          }
        },
        {
          $group: {
            _id: "$_id",
            street: { $first: "$street" },
            suite: { $first: "$suite" },
            city: { $first: "$city" },
            state: { $first: "$state" },
            zip: { $first: "$zip" },
            escrowNumber: { $first: "$escrowNumber" },
            openDate: { $first: "$openDate" },
            finalDate: { $first: "$finalDate" },
            expectedCloseDate: { $first: "$expectedCloseDate" },
            parcelNumber: { $first: "$parcelNumber" },
            transactionType: { $first: "$transactionType" },
            people: { $first: "$people" },
            tenantId: { $first: "$tenantId" },
            escrowStatus: { $first: "$escrowStatus" }
          }
        },
        { $sort: { expectedCloseDate: 1 } },
        { $skip: (currentPage - 1) * itemsListed },
        { $limit: itemsListed }
      ])
      .toArray()
      .then(response => {
        for (let i = 0; i < response.length; i++) {
          let item = response[i];
          item._id = item._id.toString();
        }
        return response;
      });
  }
}

function readAll() {
  return connection
    .db()
    .collection("escrow")
    .find()
    .toArray()
    .then(response => {
      for (let i = 0; i < response.length; i++) {
        let escrow = response[i];
        escrow._id = escrow._id.toString();
      }
      return response;
    });
}

function readById(id) {
  return connection
    .db()
    .collection("escrow")
    .findOne({ _id: new ObjectId(id) })
    .then(response => {
      const people = response.people;
      const promises = [];
      // Do a query for each person and push in promises array
      for (let personObj of people) {
        if (personObj.person) {
          promises.push(
            connection
              .db()
              .collection("people")
              .findOne({ _id: ObjectId(personObj.person._id) })
              .then(person => person)
          );
        } else {
          promises.push({});
        }
      }
      // Wait for all queries
      return Promise.all(promises).then(person => {
        // Reassign the each person to people array

        for (let i = 0; i < person.length; i++) {
          response.people[i].person = person[i];
        }

        response._id = response._id.toString();
        return response;
      });
    });
}

function create(body) {
  body.people.forEach(obj => {
    obj.person._id = obj.person._id.toString();
  });
  return connection
    .db()
    .collection("escrow")
    .insert(body)
    .then(result => result.insertedIds[0].toString());
}

function update(id, doc) {
  doc._id = new ObjectId(doc._id);
  delete doc._id;
  return connection
    .db()
    .collection("escrow")
    .update({ _id: new ObjectId(id) }, { $set: doc })
    .then(result => Promise.resolve());
}

function deleteEscrow(id) {
  return connection
    .db()
    .collection("escrow")
    .deleteOne({ _id: new ObjectId(id) })
    .then(result => Promise.resolve());
}
