const generateButton = document.getElementById('generate');
const generateAgainButton = document.getElementById('generate-again');
const generateMoreButton = document.getElementById('generate-more');
const responseSection = document.getElementById('response-1');
const responseSection2 = document.getElementById('response-2');

var markdownConverter = new showdown.Converter();

generateButton.addEventListener('click', () => {
    generateButton.classList.add('d-none');
    generateAgainButton.classList.remove('d-none');
    //responseSection.innerHTML = 'Response 1';
});

generateAgainButton.addEventListener('click', () => {
    generateAgainButton.classList.add('d-none');
    generateMoreButton.classList.remove('d-none');
    responseSection.innerHTML = responseSection2.innerHTML;
});


function fetchData() {
    // Replace with your actual data fetching logic
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Response from server');
        }, 2000);
    });
}

/*

generateMoreButton.addEventListener('click', () => {
  showLoadingIndicator();
  fetchData().then(response => {
    hideLoadingIndicator();
    responseSection.innerHTML = `<br>${response}`;
  });
});
*
function showLoadingIndicator() {
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.classList.remove('d-none');

}

function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.classList.add('d-none');

}*/

/*
generateMoreButton.addEventListener('click', () => {
  generateMoreButton.disabled = true;
  showLoadingIndicator();
  fetchData().then(response => {
    hideLoadingIndicator();
    generateMoreButton.disabled = false;
    responseSection.innerHTML = `${response}`;
  });
});
*/

generateMoreButton.addEventListener('click', () => {
  generateMoreButton.disabled = true;
  showLoadingIndicator();

  // Randomly choose a function
  const functions = [getResponseGemini, getResponseCloudFlare];
  const randomFunction = functions[Math.floor(Math.random() * functions.length)];

  randomFunction();
    /*.then(response => {
      hideLoadingIndicator();
      generateMoreButton.disabled = false;
      responseSection.innerHTML = `${response}`;
    })
    .catch(error => {
      hideLoadingIndicator();
      generateMoreButton.disabled = false;
      console.error('Error fetching data:', error);
      // Handle error appropriately
    });*/
});

// Replace with your actual function implementations
/*
function getResponseGemini() {
  // ... logic to fetch data from Gemini
  // Replace with your actual data fetching logic
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Response from gemini');
        }, 2000);
    });
}

function getResponseCloudFlare() {
  // ... logic to fetch data from CloudFlare
  // Replace with your actual data fetching logic
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Response from cf');
        }, 2000);
    });
}
*/

function showLoadingIndicator() {
  //const spinner = generateMoreButton.querySelector('.spinner-border');
  //spinner.classList.remove('d-none');
  generateMoreButton.innerHTML = 'Generating <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="visually-hidden">Loading...</span>';
}

function hideLoadingIndicator() {
  //const spinner = generateMoreButton.querySelector('.spinner-border');
  //spinner.classList.add('d-none');
  generateMoreButton.innerHTML = "Generate More";
}



///////////////////
//gemini function
//////////////////

import { GoogleGenerativeAI } from "@google/generative-ai";

// Fetch your API_KEY
const API_KEY = "AIzaSyDy1Y_GNYSNurZiHbFU96v_sRmJr-vT3OQ";

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
  
async function getResponseGemini() {
  //const prompt = "give few pubg user names."
  const prompt = document.getElementById('prompt').value;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  hideLoadingIndicator();
  generateMoreButton.disabled = false;
  responseSection.innerHTML = processResponse(text); // '<p><pre>' + text + '</pre></p>'; //`${text}`;
  
  //document.getElementById('response').innerHTML = '<p><pre>' + text + '</pre></p>';
  console.log('Response from Gemini.');
  console.log(text);
}


///////////////////////
//cloudFlare function
//////////////////////

async function getResponseCloudFlare() {
  // ... logic to fetch data from CloudFlare
  const prompt = document.getElementById('prompt').value;
  
  const chat = {messages: [
    {
      role: "system",
      content: "You are helpfull assistant.",
    },
    {
      role: "user",
      content:
        prompt,
    },
  ]};
  
  const formData = new FormData();

  // Add a text field
  formData.append("messages", JSON.stringify(chat));
  
  const response = await fetch(
    
    'https://cf-ai-worker.boysofts.workers.dev/',
    {
      //headers: { Authorization: "Bearer vulOtiSL6N8Vrrsxc-wP_L_C8uFk4S8zTlT4osQx" },
      method: "POST",
      body: formData, //JSON.stringify(input),
    }
  );
  const result = await response.json();
  
  hideLoadingIndicator();
  generateMoreButton.disabled = false;
  const text =  result['response'];
  responseSection.innerHTML = processResponse(text); //'<p><pre>' + text + '</pre></p>'; //`${text}`;
  
  console.log('Response from CloudFlare.');
  console.log(text);
}


function processResponse(serverResponse) {
  const htmlRegex = /<html[^>]*>(.*)<\/html>/s;
  const match = serverResponse.match(htmlRegex);

  if (match) {
    return match[1]; // Extract the HTML content
  } else {
    // Handle Markdown
    // Use a Markdown-to-HTML converter library
    const convertedHtml = markdownConverter.makeHtml(serverResponse);
    return convertedHtml;
  }
}


const promptTextArea = document.getElementById('prompt');
const charCount = document.getElementById('char-count');
const maxChars = 500;

promptTextArea.addEventListener('input', () => {
  const currentLength = promptTextArea.value.length;
  if(currentLength>=maxChars){ alert("Maximum Size of question is reached."); }
  charCount.textContent = `${currentLength}/${maxChars}`;
});
