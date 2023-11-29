import "./styles.css";

if (module.hot) {
  module.hot.accept();
}

function getElementById<T>(id: string) {
  return document.getElementById(id) as T | null;
}

/* Handle form submit */
getElementById<HTMLFormElement>("newsletter-form")?.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    var formData = new FormData(form);

    // At least one topic is required
    if (!formData.getAll("topic").length) {
      return;
    }

    // Replace form with confirmation message
    form.parentNode?.appendChild(generateConfirmation(formData));
    form.parentNode?.removeChild(form);
  }
);

/* Add topic button event */
getElementById<HTMLButtonElement>("add-topic-button")?.addEventListener(
  "click",
  () => {
    const topicSelect = getElementById<HTMLSelectElement>("select-topics");
    const selectedOption = topicSelect?.options[topicSelect.selectedIndex];
    if (!selectedOption || selectedOption.disabled) {
      return;
    }

    selectedOption.hidden = true;
    topicSelect.selectedIndex = 0;

    // Append selected topic
    getElementById<HTMLDivElement>("selected-topics-wrapper")?.appendChild(
      generateTopicRow(selectedOption)
    );
  }
);

const generateTopicRow = (selectedOption: HTMLOptionElement) => {
  // Create topic row
  const div = document.createElement("div");
  div.id = selectedOption.value;
  div.textContent = selectedOption?.innerText;

  // Button for removing selected topic
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "🗑️";
  deleteButton.addEventListener("click", () => {
    getElementById<HTMLDivElement>("selected-topics-wrapper")?.removeChild(div);
    selectedOption.hidden = false; // Show option after removed from selected topics
  });

  // Input to handle form value
  const input = document.createElement("input");
  input.name = "topic";
  input.value = selectedOption.value;
  input.hidden = true;

  div.appendChild(deleteButton);
  div.appendChild(input);

  return div;
};

/* Generate confirmation */
const generateConfirmation = (formData: FormData) => {
  const div = document.createElement("div");
  const heading = document.createElement("h2");
  heading.textContent = "Tack för din anmälan";
  div.appendChild(heading);

  // Name
  const name = document.createElement("p");
  name.textContent = `Namn: ${formData.get("name")}`;
  div.appendChild(name);

  // Email
  const email = document.createElement("p");
  email.textContent = `E-post: ${formData.get("email")}`;
  div.appendChild(email);

  // Topic heading
  const topicHeading = document.createElement("p");
  topicHeading.textContent = "Områden:";
  div.appendChild(topicHeading);

  const topicSelect = getElementById<HTMLSelectElement>("select-topics");

  // Topic list
  const topicUl = document.createElement("ul");
  formData.getAll("topic").forEach((t) => {
    const li = document.createElement("li");
    const text = topicSelect?.querySelector(`option[value=${t}]`)?.innerHTML;
    if (text) {
      li.textContent = text;
      topicUl.appendChild(li);
    }
  });
  div.appendChild(topicUl);

  return div;
};
