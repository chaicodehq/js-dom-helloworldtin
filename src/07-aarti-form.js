/**
 * 🙏 Aarti Form - Form Handling, preventDefault & Validation
 *
 * Mandir ki aarti booking form bana rahe hain! Bhakton ka naam, aarti type,
 * aur date validate karke submit karna hai. Form submit hone pe page reload
 * nahi hona chahiye (preventDefault), pehle sab fields validate karo,
 * phir success ya error callback call karo. Jaise mandir mein pujari
 * entry check karta hai ki sab theek hai, waise hi form ko validate karo.
 *
 * Functions:
 *
 *   1. validateName(name)
 *      - Name must be a string, 2-50 characters long
 *      - Only letters (a-z, A-Z) and spaces allowed
 *      - Returns { valid: true, error: null } if valid
 *      - Returns { valid: false, error: "error message" } if invalid
 *      - Error messages (Hinglish):
 *        - Not string: "Naam string hona chahiye"
 *        - Too short: "Naam mein kam se kam 2 characters hone chahiye"
 *        - Too long: "Naam 50 characters se zyada nahi ho sakta"
 *        - Invalid chars: "Naam mein sirf letters aur spaces allowed hain"
 *
 *   2. validateDate(dateString)
 *      - Must be a valid date string in YYYY-MM-DD format
 *      - Must be today or a future date (past dates not allowed)
 *      - Returns { valid: true, error: null } if valid
 *      - Returns { valid: false, error: "error message" } if invalid
 *      - Error messages:
 *        - Not string: "Date string honi chahiye"
 *        - Invalid format: "Date YYYY-MM-DD format mein honi chahiye"
 *        - Past date: "Date aaj ya future ki honi chahiye"
 *
 *   3. validateAartiType(type)
 *      - Must be one of: "morning", "evening", "special"
 *      - Returns { valid: true, error: null } if valid
 *      - Returns { valid: false, error: "error message" } if invalid
 *      - Error messages:
 *        - Not string: "Aarti type string hona chahiye"
 *        - Invalid type: "Aarti type morning, evening, ya special mein se hona chahiye"
 *
 *   4. setupAartiForm(formElement, onSuccess, onError)
 *      - Adds "submit" event listener on formElement with preventDefault()
 *      - On submit: reads form fields:
 *        - name: from input/element with name="name" (formElement.elements.name.value)
 *        - date: from input with name="date"
 *        - aartiType: from select/input with name="aartiType"
 *      - Validates all three fields using above functions
 *      - If ALL valid: calls onSuccess({ name, date, aartiType })
 *      - If ANY invalid: calls onError(errorsArray) where errorsArray contains
 *        error strings from each failed validation
 *      - Returns cleanup function that removes the submit listener
 *      - Agar formElement null/undefined, return null
 *      - Agar onSuccess or onError not functions, return null
 *
 *   5. createBookingSummary(booking)
 *      - Takes { name, date, aartiType } object
 *      - Creates a div.booking-summary containing:
 *        - h3 with text "Booking Confirmation"
 *        - p.booking-name with text "Bhakt: {name}"
 *        - p.booking-date with text "Date: {date}"
 *        - p.booking-type with text "Aarti: {aartiType}"
 *      - Returns the div element
 *      - Agar booking null/undefined or missing fields, return null
 *
 * Hint: event.preventDefault() form ka default submit behavior rokta hai.
 *   formElement.elements se form ke inputs access karo by name attribute.
 *
 * @example
 *   validateName("Rahul Sharma");
 *   // => { valid: true, error: null }
 *
 *   validateName("R");
 *   // => { valid: false, error: "Naam mein kam se kam 2 characters hone chahiye" }
 *
 *   validateDate("2025-12-25");
 *   // => { valid: true, error: null } (if date is in future)
 *
 *   validateAartiType("morning");
 *   // => { valid: true, error: null }
 *
 *   const summary = createBookingSummary({
 *     name: "Rahul", date: "2025-12-25", aartiType: "morning"
 *   });
 *   // => <div class="booking-summary">...</div>
 */
export function validateName(name) {
  const namePattern = /^[A-Za-z ]+$/;

  let errorMessage = "";
  if (typeof name !== "string") {
    errorMessage = "Naam string hona chahiye";
  } else if (!namePattern.test(name)) {
    errorMessage = "Naam mein sirf letters aur spaces allowed hain";
  } else if (name.length < 2) {
    errorMessage = "Naam mein kam se kam 2 characters hone chahiye";
  } else if (name.length > 50) {
    errorMessage = "Naam 50 characters se zyada nahi ho sakta";
  }

  if (errorMessage.length > 0) {
    return { valid: false, error: errorMessage };
  }
  return { valid: true, error: null };
}

export function validateDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  let errorMessage = "";

  const validateDate = () => {
    const [year] = dateString.split("-");

    const now = new Date();

    if (parseInt(year) >= now.getFullYear()) {
      return true;
    }
    return false;
  };

  if (typeof dateString !== "string") {
    errorMessage = "Date string honi chahiye";
  } else if (!dateRegex.test(dateString)) {
    errorMessage = "Date YYYY-MM-DD format mein honi chahiye";
  } else if (!validateDate()) {
    errorMessage = "Date aaj ya future ki honi chahiye";
  }
  if (errorMessage.length > 0) {
    return { valid: false, error: errorMessage };
  }
  return { valid: true, error: null };
}

export function validateAartiType(type) {
  const validTypes = ["morning", "evening", "special"];
  let errorMessage = "";

  if (typeof type !== "string") {
    errorMessage = "Aarti type string hona chahiye";
  } else if (!validTypes.includes(type)) {
    errorMessage =
      "Aarti type morning, evening, ya special mein se hona chahiye";
  }
  if (errorMessage.length > 0) {
    return { valid: false, error: errorMessage };
  }
  return { valid: true, error: null };
}

export function setupAartiForm(formElement, onSuccess, onError) {
  if (!formElement) return null;

  if (typeof onSuccess !== "function" || typeof onError !== "function")
    return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = formElement.elements.name.value;
    const aartiType = formElement.elements.aartiType.value;
    const date = formElement.elements.date.value;

    const error = [];

    const nameRes = validateName(name);
    if (!nameRes.valid) error.push(nameRes.error);

    const aartiTypeRes = validateAartiType(aartiType);
    if (!aartiTypeRes.valid) error.push(aartiTypeRes.error);

    const dateRes = validateDate(date);
    if (!dateRes.valid) error.push(dateRes.error);

    if (error.length > 0) {
      onError(error);
    } else {
      onSuccess({ name, date, aartiType });
    }
  };
  formElement.addEventListener("submit", handleSubmit);

  return () => formElement.removeEventListener("submit", handleSubmit);
}

export function createBookingSummary(booking) {
  if (!booking || !booking.name || !booking.aartiType || !booking.date)
    return null;

  const div = document.createElement("div");
  div.classList.add("booking-summary");

  const h3 = document.createElement("h3");
  h3.textContent = "Booking Confirmation";

  const p1 = document.createElement("p");
  p1.classList.add("booking-name");
  p1.textContent = `Bhakt: ${booking.name}`;

  const p2 = document.createElement("p");
  p2.classList.add("booking-date");
  p2.textContent = `Date: ${booking.date}`;

  const p3 = document.createElement("p");
  p3.textContent = `Aarti: ${booking.aartiType}`;
  p3.classList.add("booking-type");

  div.appendChild(h3);
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(p3);

  return div;
}
