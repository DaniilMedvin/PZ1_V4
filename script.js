const $ = (id) => document.getElementById(id);

const form = $("form");
const price = $("price");
const qty = $("qty");

const money = (n) => n.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const setError = (input, errorEl, message) => {
  errorEl.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
};

const validate = () => {
  const p = parseFloat(price.value);
  const q = Number(qty.value);
  const okPrice = setError(price, $("priceError"), Number.isFinite(p) && p >= 0 && price.value !== "" ? "" : "Введіть коректну вартість");
  const okQty = setError(qty, $("qtyError"), Number.isInteger(q) && q >= 1 ? "" : "Кількість — ціле число від 1");
  const okTier = setError(form, $("tierError"), form.elements.tier.value === "" ? "Оберіть категорію покупця" : "");
  return okPrice && okQty && okTier ? { p, q } : null;
};

const animateTo = (el, text) => {
  el.textContent = text;
  el.classList.remove("pulse");
  void el.offsetWidth;
  el.classList.add("pulse");
};

const calculate = () => {
  const data = validate();
  if (!data) return;
  $("result").hidden = false;
  const rate = Number(form.elements.tier.value);
  const subtotal = data.p * data.q;
  const discount = subtotal * rate / 100;

  animateTo($("subtotal"), money(subtotal));
  animateTo($("discount"), "−" + money(discount));
  animateTo($("total"), money(subtotal - discount) + " грн");
  $("rate").textContent = rate + "%";
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  calculate();
});

[price, qty].forEach((el) => el.addEventListener("input", () => el.setAttribute("aria-invalid", "false")));

form.querySelectorAll("input[name=tier]").forEach((el) =>
  el.addEventListener("change", () => {
    $("tierError").textContent = "";
    if (price.value !== "") calculate();
  })
);
