// const firebaseConfig = {
//   apiKey: "AIzaSyCwK0ichC-DJxoec0RFrAPsUMEPIwvQzE4",
//   authDomain: "foodcourt-80fc0.firebaseapp.com",
//   databaseURL: "https://foodcourt-80fc0-default-rtdb.firebaseio.com",
//   projectId: "foodcourt-80fc0",
//   storageBucket: "foodcourt-80fc0.appspot.com",
//   messagingSenderId: "382207958425",
//   appId: "1:382207958425:web:1d65a262f2cd79d168c708",
//   measurementId: "G-F94HZSH65B",
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// Reference to the Firebase database
var database = firebase.database();
// Reference to the root of your Firebase structure
// Reference to the root of your Firebase structure
let rootRef = database.ref("Orders");
let chekedItems = database.ref("checkedItems");
let orderstobeprepared = database.ref("orderstobeprepared");
// Reference to the table body
var tableBody = document.querySelector(".table-unchecked");
var tableBodyOrders = document.querySelector(".table-orders");

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
const usersRef = db.collection("Users");
// Dictionary to store counts of food items
var foodItemCounts = {};
let timearr = [];

let foodItemsTokennumbers = {};
var foodarray = [];
let tokenconfirmations = [];
function order_confirm() {
  var foodItemsTimings = {}; // Create an object to store food items and their timings

  let count = 0;
  orderstobeprepared.on("value", function (snapshot) {
    const token = snapshot.val();
    // console.log(token);
    if (token) {
      for (var key in token) {
        var tokenData = token[key];
        // console.log(tokenData);

        if (!tokenconfirmations.includes(key)) {
          tokenconfirmations.push(key);
          // console.log(tokenconfirmations);
          // if (tokenData.hasOwnProperty(key)) {
          let foodItemsArray = tokenData.foodItem.split(",");
          // if(foodItemsArray){
          //   console.log("in"+foodItemsArray);
          // }else{
          //   console.log("array is empty!");
          // }

          foodItemsArray.forEach(function (foodItem) {
            // Trim leading/trailing spaces
            // console.log(foodItem);
            foodItem = foodItem.trim();
            // let flag=0;
            // console.log(foodItem);

            if (count > 0) {
              let flag = 0; // Initialize the flag to 0

              for (let i = 0; i < count; i++) {
                // console.log("foodarray[i]", foodarray[i]);
                if (foodarray[i] === foodItem) {
                  flag = 1;
                  // console.log(foodItem);
                  break;
                }
              }

              if (flag === 0) {
                // If the foodItem is not found in the array, add it

                // console.log(foodItem);
                foodarray[count] = foodItem;
                count++;
              }
            } else {
              // If the array is empty, add the foodItem

              // console.log(foodItem);
              foodarray[count] = foodItem;
              count++;
            }

            // Create a new row in the "Orders to be Prepared" table or find an existing row
            var existingRow = tableBodyOrders.querySelector(
              `tr[data-food-item="${foodItem}`
            );

            if (existingRow) {
              // Update the count in the existing row
              var countCell = existingRow.querySelector(".item-number");
              var currentCount = parseInt(countCell.textContent);
              countCell.textContent = currentCount + 1;

              // Update the timings in the existing row
              foodItemsTimings[foodItem].push(tokenData.time);
              foodItemsTokennumbers[foodItem].push(key);
              var timeCell = existingRow.querySelector(".item-time");
              timeCell.textContent = foodItemsTimings[foodItem].join(", ");

              var timeCell2 = existingRow.querySelector(".token-numbers");
              timeCell2.textContent =
                foodItemsTokennumbers[foodItem].join(", ");
            } else {
              // Create a new row
              foodItemsTimings[foodItem] = [tokenData.time]; // Initialize an array to store timings for this food item
              foodItemsTokennumbers[foodItem] = [key];

              var newRow = document.createElement("tr");
              newRow.setAttribute("data-food-item", foodItem); // Set a unique data attribute
              newRow.innerHTML = `
                            <td></td>
                            <td>${foodItem}</td>
                            <td class="item-number">1</td>
                            <td class="item-time">${tokenData.time}</td>
                            <td class="token-numbers">${foodItemsTokennumbers[
                  foodItem
                ].join(", ")}</td>

                          `;
              // console.log("Token "+foodItemsTokennumbers[foodItem]);
              // <td><button class="clear-button" data-tokens='${JSON.stringify(foodItemsTokennumbers[foodItem])}' onclick="markOrderAsDone(this, '${foodItem}', '${time}')">Done</button></td>

              // Set the serial number in the first cell of the new row
              var allRows =
                tableBodyOrders.querySelectorAll("tr[data-food-item]");
              newRow.querySelector("td:first-child").textContent =
                allRows.length + 1;

              // Append the row to the "Orders to be Prepared" table
              tableBodyOrders.appendChild(newRow);
            }
          });

          const tableRows = document.querySelectorAll(".table-orders tr");
          let fname;
          tableRows.forEach(function (row) {
            row.addEventListener("click", function () {
              // Get all of the rows in the table
              const allRows = tableRows;

              // Find the current row
              const currentRow = this;

              // Loop through all of the rows and remove the border from each row except the current row
              allRows.forEach(function (row) {
                if (row !== currentRow) {
                  row.style.boxShadow = "";
                }
              });

              // Change the border of the current row
              currentRow.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.75)";

              const foodItem = row.querySelector("td:nth-child(2)").textContent;
              if (foodItem) {
                fname = foodItem;
              }
              const time = row.querySelector("td:nth-child(4)").textContent;

              var timeArray = time.split(",");
              // console.log(timeArray)

              const token = row.querySelector("td:nth-child(5)").textContent;
              var tokenArray = token.split(",");
              // console.log(tokenArray)
              var itemsorder = document.querySelector(".content");
              itemsorder.innerHTML = "";
              let token_count = 0;
              timeArray.forEach(function (timing) {
                let token_perticular;

                token_perticular = tokenArray[token_count];
                token_count++;

                // Trim leading/trailing spaces
                var timming = timing.trim();
                // console.log(token_perticular);

                // Create a new row in the "Orders to be Prepared" table or find an existing row
                var existingRow = itemsorder.querySelector(
                  `tr[data-food-item-time="${fname}-${timming}"]`
                );
                // console.log(existingRow);

                if (existingRow) {
                  // Update the count in the existing row
                  var countCell = existingRow.querySelector(".item-number");
                  var currentCount = parseInt(countCell.textContent);
                  countCell.textContent = currentCount + 1;
                } else {
                  // Create a new row
                  var done_order = document.querySelector(".done_order");
                  done_order.innerHTML = `
                                        <button class="clear-button" data-tokens='${JSON.stringify(
                    foodItemsTokennumbers[fname]
                  )}' 
                                        onclick="markOrderAsDone(this,'${fname}', '${time}')">Done</button><br>
                                          `;
                  var newRow = document.createElement("tr");
                  // console.log(fname);
                  newRow.setAttribute(
                    "data-food-item-time",
                    `${fname}-${timming}`
                  ); // Set a unique data attribute
                  newRow.innerHTML = `
                                       
                        
                                        <td>${fname}</td>
                                        <td class="item-number">1</td>
                                        <td class="item-time">${timing}</td>
                                        <button class="clear-button" onclick="addRowToContentTable('${token_perticular}','${fname}','${timing}')">Done</button><br>
                        
                                    `;

                  // Append the row to the "Orders to be Prepared" table
                  itemsorder.appendChild(newRow);
                }
              });
            });
          });
        }
      }
    }
  });
}

order_confirm();
function onclick() {
  dashboardLeft.style.display = "none";
  dashboardRight.style.display = "block";
}
// // Sample function to dynamically generate and add rows to the "content" table
function addRowToContentTable(token1, itemName, time) {
  // console.log(itemName, time, token1);
  let token = token1.trim();
  let oredrsRef = orderstobeprepared.child(token);

  oredrsRef.on(
    "value",
    (snapshot) => {
      console.log(itemName, time, token);
      if (snapshot.exists()) {
        // const existingData = snapshot.val();
        const existingData = snapshot.val();
        // console.log(existingData);

        let previousfoodItemarray = existingData.foodItem
          ? existingData.foodItem.split(",")
          : [];
        let updatedfoodItemarray = [];
        // console.log(previousfoodItemarray.length);
        if (previousfoodItemarray.length === 0) {
          // Delete the confirmed order from the "Unchecked Orders" table and Firebase

          console.log("food:" + foodItemsTokennumbers[itemName]);
          var rowToDelete1 = document.querySelector(
            `.table-orders tr[data-food-item="${itemName}"]`
          );

          if (rowToDelete1) {
            var itemsorder = document.querySelector(".content");
            itemsorder.innerHTML = "";
            rowToDelete1.remove();
          }
          // Fetch the checked-order details
          const checkedItems = database.ref("checkedItems").child(token);

          checkedItems
            .once("value")
            .then(function (snapshot) {
              const tokenData = snapshot.val();

              if (tokenData && tokenData.foodItem && tokenData.time) {
                const updateData = {
                  token: tokenData.token,
                    foodItem: tokenData.foodItem,
                    gmail: tokenData.gmail,
                    time: tokenData.time,
                    amount: tokenData.amount,
                    prepared_status: "prepared",
                };
                let gmail = tokenData.gmail;
                console.log(gmail, tokenData.token)
                if (gmail && tokenData.token) {
                  let Orderdetails = usersRef.doc(gmail).collection("orderdetails");

                  Orderdetails.doc(tokenData.token).update({
                    OrderStatus: "prepared",
                    PayStatus: "paid",
                  }).then(function () {
                    console.log("OrderStatus updated successfully.");
                  }).catch(function (error) {
                    console.error("Error updating OrderStatus:", error);
                  });
                } else {
                  console.error("Gmail or key is undefined for an item in checkedItem.");
                }
                // Updated the order status in Firebase for "checkedItems"
                checkedItems
                  .set(updateData)
                  .then(function () {
                    console.log(
                      "Food name updated successfully in checkedItems"
                    );
                  })
                  .catch(function (error) {
                    console.error(
                      "Error updating food name in checkedItems:",
                      error
                    );
                  });

                // Delete the prepared items from the "orderstobeprepared" tree in Firebase
                orderstobeprepared
                  .child(token)
                  .remove()
                  .then(function () {
                    console.log(
                      "Token deleted successfully from orderstobeprepared"
                    );
                  })
                  .catch(function (error) {
                    console.error(
                      "Error deleting token from orderstobeprepared:",
                      error
                    );
                  });
              } else {
                console.log("Token not found in checkedItems.");
              }
            })
            .catch(function (error) {
              console.error(
                "Error retrieving token details from checkedItems:",
                error
              );
            });

          console.log("prepared! " + itemName + " " + token);
          // console.log("prepared");
        } else {
          previousfoodItemarray.forEach(function (foodItem) {
            if (foodItem != itemName) {
              updatedfoodItemarray.push(foodItem);
              // console.log("fooditems remaining to p"+updatedfoodItemarray);
            } else {
              var rowToDelete = document.querySelector(
                `.content tr[data-food-item-time="${itemName}-${time}"]`
              );
              if (rowToDelete) {
                // var itemsorder = document.querySelector(".content");
                // itemsorder.innerHTML = ""
                rowToDelete.remove();
              }
            }
          });

          if (existingData) {
            // An entry with the same token exists, update it
            const updatedFoodItems = updatedfoodItemarray.join(",");
            const updatedTime = time;
            const updatedStatus = "preparing";

            const updateData = {
              foodItem: updatedFoodItems,
              time: updatedTime,
              prepared_status: updatedStatus,
            };

            // Update the existing entry with the same token
            orderstobeprepared
              .child(token)
              .set(updateData)
              .then(function () {
                location.reload();
                //   onclick();
                console.log("Food items updated successfully for preparing");
              })
              .catch(function (error) {
                console.warn("Error updating food items for preparing:", error);
              });
          }
        }
      } else {
        console.log("Data does not exist at the specified location.");
      }
    },
    (error) => {
      console.error("Error fetching data:", error);
    }
  );
}

// function markOrderAsDone(button, foodname, time, tokenNumber) {
//   console.log(tokenNumber["masala dosa"]);
//   // tokenNumber.forEach((token) => {
//   //   // Handle marking an order as done if needed
//   //   // In this example, we remove the item from the "Orders to be Prepared" table
//   //   // Replace this with your own logic
//     // const button = document.querySelector(`#doneButton-${token}`);
//   //   button.closest("tr").remove();

//   //   // Call the function to check if all food items are prepared for this token
//   //   // checkAllFoodPrepared(token);
//   // });

// }

//   const tableRow = document.querySelector(".content tr");

// // const tableRows = tableRow;
//   if(tableRow) {
//      // Define the tableRows variable
//     console.log(tableRow);
//     tableRow.forEach(function (row) {
//       row.addEventListener("click", function () {
//         console.log("Click working")

//         // Get all of the rows in the table
//         const allRows = tableRow;

//         // Find the current row
//         const currentRow = this;

//         // Loop through all of the rows and remove the border from each row except the current row
//         allRows.forEach(function (row) {
//           if (row !== currentRow) {
//             row.style.boxShadow = "";
//           }
//         });

//         // Change the border of the current row
//         currentRow.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.75)";

//         const foodItem = row.querySelector("td:nth-child(2)").textContent;
//         if (foodItem) {
//           fname = foodItem;
//         }
//         const time = row.querySelector("td:nth-child(4)").textContent;
//         console.log(fname, time)
//         // Create a new row
//         // var done_order = document.querySelector(".done_order2");
//         // done_order.innerHTML = `
//         //       <button class="clear-button" data-tokens='${JSON.stringify(foodItemsTokennumbers[fname])}'
//         //       onclick="markOrderAsDone(this, '${fname}', '${time}', ${foodItemsTokennumbers[fname]})">Done</button><br>
//         //       `;
//       });
//     });
//   }

let prepared_items = [];
let prepared_items_count = 0;
let remaining_items = {};

function markOrderAsDone(button, foodname, time) {
  console.log("foodname:", foodname);
  console.log("time:", time);

  // Delete the confirmed order from the "Unchecked Orders" table and Firebase
  var rowToDelete = document.querySelector(
    `.table-orders tr[data-food-item="${foodname}"]`
  );
  if (rowToDelete) {
    var itemsorder = document.querySelector(".content");
    itemsorder.innerHTML = "";
    rowToDelete.remove();
  }

  const tokens = JSON.parse(button.getAttribute("data-tokens"));

  try {
    if (foodItemsTokennumbers[foodname]) {
      tokens.forEach(function (token) {
        let isPreparing = false;
        let RF_token, RF_time;
        let otherFoodItems = [];

        for (let i = 0; i < foodarray.length; i++) {
          var fname = foodarray[i];
          if (
            fname !== foodname &&
            foodItemsTokennumbers[fname] &&
            foodItemsTokennumbers[fname].includes(token) &&
            !prepared_items.includes(token)
          ) {
            otherFoodItems.push(fname);
            RF_token = token;
            RF_time = time;
            isPreparing = true;
          }
        }

        if (isPreparing) {
          // Check if an entry with the same token already exists in "orderstobeprepared"
          orderstobeprepared
            .child(RF_token)
            .once("value")
            .then(function (snapshot) {
              const existingData = snapshot.val();

              if (existingData) {
                // An entry with the same token exists, update it
                const updatedFoodItem = otherFoodItems.join(", ");
                const updatedTime = RF_time;
                const updatedStatus = "preparing";

                const updateData = {
                  foodItem: updatedFoodItem,
                  time: updatedTime,
                  prepared_status: updatedStatus,
                };

                // Update the existing entry with the same token
                orderstobeprepared
                  .child(RF_token)
                  .set(updateData)
                  .then(function () {
                    console.log(
                      "Food items updated successfully for preparing"
                    );
                  })
                  .catch(function (error) {
                    console.warn(
                      "Error updating food items for preparing:",
                      error
                    );
                  });
              }
            });
          console.log("preparing " + foodname + " " + token);
        } else {
          if (!prepared_items.includes(token)) {
            prepared_items.push(token);
            prepared_items_count++;

            // Fetch the checked-order details
            const checkedItems = database.ref("checkedItems").child(token);

            checkedItems
              .once("value")
              .then(function (snapshot) {
                const tokenData = snapshot.val();
                console.log("here:",tokenData)
                if (tokenData && tokenData.foodItem && tokenData.time) {
                  const updateData = {
                    token: tokenData.token,
                    foodItem: tokenData.foodItem,
                    gmail: tokenData.gmail,
                    time: tokenData.time,
                    amount: tokenData.amount,
                    prepared_status: "prepared",
                  };

                  let gmail = tokenData.gmail;
                console.log(gmail, tokenData.token)
                if (gmail && tokenData.token) {
                  let Orderdetails = usersRef.doc(gmail).collection("orderdetails");

                  Orderdetails.doc(tokenData.token).update({
                    OrderStatus: "prepared",
                    PayStatus: "paid",
                  }).then(function () {
                    console.log("OrderStatus updated successfully.");
                  }).catch(function (error) {
                    console.error("Error updating OrderStatus:", error);
                  });
                } else {
                  console.error("Gmail or key is undefined for an item in checkedItem.");
                }
                  // Updated the order status in Firebase for "checkedItems"
                  checkedItems
                    .set(updateData)
                    .then(function () {
                      console.log(
                        "Food name updated successfully in checkedItems"
                      );
                    })
                    .catch(function (error) {
                      console.error(
                        "Error updating food name in checkedItems:",
                        error
                      );
                    });

                  // Delete the prepared items from the "orderstobeprepared" tree in Firebase
                  orderstobeprepared
                    .child(token)
                    .remove()
                    .then(function () {
                      console.log(
                        "Token deleted successfully from orderstobeprepared"
                      );
                    })
                    .catch(function (error) {
                      console.error(
                        "Error deleting token from orderstobeprepared:",
                        error
                      );
                    });
                } else {
                  console.log("Token not found in checkedItems.");
                }
              })
              .catch(function (error) {
                console.error(
                  "Error retrieving token details from checkedItems:",
                  error
                );
              });

            console.log("prepared! " + foodname + " " + token);
          }
        }
      });

      // Remove the current foodname from foodItemsTokennumbers
      delete foodItemsTokennumbers[foodname];
    } else {
      console.error("foodItem not present!");
    }
  } catch (error) {
    console.error("Error: " + error);
  }
}

let ham = document.getElementById("hamburger-open");
let cancel = document.getElementById("hamburger-cancel");
let sidebar = document.querySelector(".sidebar");
ham.addEventListener("click", function () {
  ham.style.display = "none";
  cancel.style.display = "block";
  sidebar.style.transition = "1s";
  sidebar.style.transform = "translateX(0px)";
});
cancel.addEventListener("click", function () {
  cancel.style.display = "none";
  ham.style.display = "block";

  sidebar.style.transform = "translateX(-1666px)";
});
