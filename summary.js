const subscriptions = [
  { name: "Music plan", amount: 599, frequency: "Monthly", day: 5 },
  { name: "Video streaming", amount: 799, frequency: "Monthly", day: 12 },
  { name: "Cloud storage", amount: 299, frequency: "Monthly", day: 20 },
  { name: "Student software", amount: 4999, frequency: "Yearly", month: 11, day: 8 }
];

const purchases = [
  { name: "School supplies", amount: 1850, date: "2026-09-04" },
  { name: "Groceries", amount: 3620, date: "2026-09-18" },
  { name: "Textbook", amount: 4850, date: "2026-10-03" },
  { name: "Groceries", amount: 3275, date: "2026-10-14" },
  { name: "Bus pass", amount: 2500, date: "2026-10-21" },
  { name: "Groceries", amount: 2840, date: "2026-11-06" }
];

const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

function formatMoney(amount) {
  return "$" + (amount / 100).toFixed(2);
}

function showSummary(event) {
  event.preventDefault();

  const month = Number(monthSelect.value);
  const year = Number(yearSelect.value);
  const monthName = monthSelect.options[monthSelect.selectedIndex].text;
  let subscriptionTotal = 0;
  let purchaseTotal = 0;
  let purchaseCount = 0;
  const charges = [];

  for (const subscription of subscriptions) {
    if (subscription.frequency === "Yearly" && subscription.month !== month) {
      continue;
    }

    subscriptionTotal += subscription.amount;
    charges.push({
      name: subscription.name,
      amount: subscription.amount,
      day: subscription.day,
      type: subscription.frequency + " subscription"
    });
  }

  for (const purchase of purchases) {
    const purchaseDate = purchase.date.split("-");
    if (Number(purchaseDate[0]) !== year || Number(purchaseDate[1]) !== month) {
      continue;
    }

    purchaseTotal += purchase.amount;
    purchaseCount++;
    charges.push({
      name: purchase.name,
      amount: purchase.amount,
      day: Number(purchaseDate[2]),
      type: "One-time purchase"
    });
  }

  charges.sort(function (a, b) {
    return a.day - b.day;
  });

  const rows = document.getElementById("spending-rows");
  rows.replaceChildren();

  for (const charge of charges) {
    const row = document.createElement("tr");
    const date = new Date(year, month - 1, charge.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

    for (const value of [date, charge.name, charge.type, formatMoney(charge.amount)]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }

    rows.appendChild(row);
  }

  const total = subscriptionTotal + purchaseTotal;

  document.getElementById("totals-heading").textContent = monthName + " " + year + " spending";
  document.getElementById("table-caption").textContent = "Sample charges for " + monthName + " " + year;
  document.getElementById("subscription-total").textContent = formatMoney(subscriptionTotal);
  document.getElementById("purchase-total").textContent = formatMoney(purchaseTotal);
  document.getElementById("spending-total").textContent = formatMoney(total);
  document.getElementById("table-total").textContent = formatMoney(total);

  if (purchaseCount === 0) {
    document.getElementById("purchase-note").textContent = "No one-time purchases in this sample month.";
  } else {
    document.getElementById("purchase-note").textContent = "One-time purchases are included by purchase date.";
  }
}

document.getElementById("summary-filters").addEventListener("submit", showSummary);
