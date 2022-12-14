const scrapeURL = 'http://127.0.0.1:3232/scrape';

// dom elements
let form = null;

// vars
const hasClipboard = (navigator.clipboard) ? true : false;


// auto initialization
init();


function init() {
  // get dom elements
  form = document.getElementById('scraperForm');

  // add event listeners
  form.addEventListener('submit', onFormSubmit);

  if (hasClipboard) {
    const copyButtons = document.getElementsByClassName('copy-btn');
    const numButtons = copyButtons.length;
    for (let i = 0; i < numButtons; i++) {
      const button = copyButtons[i];
      button.addEventListener('click', onCopyButtonClicked);
    }
  }
}


// form handling
function onFormSubmit(event) {
  event.preventDefault();
  event.stopPropagation();

  showSpinner();

  hideResults();
  hideError();
  hideOGWarning();
  hideTCWarning();

  var xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      var response = JSON.parse(xhr.responseText);
      showResults(response);
    } else {
      showError();
    }
    hideSpinner();
  };

  xhr.onerror = () => {
    hideSpinner();
    showError();
  }

  var payload = { url: form.urlInput.value };
  var payloadStr = JSON.stringify(payload);

  xhr.open('POST', scrapeURL);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(payloadStr);
}

function showResults(data) {
  // generic
  toggleValueElement(
    data.title,
    'metaTitleContainer',
    'metaTitleValue'
  );
  toggleValueElement(
    data.description,
    'metaDescriptionContainer',
    'metaDescriptionValue'
  );
  toggleValueElement(
    data.website,
    'metaWebsiteContainer',
    'metaWebsiteValue'
  );

  // opengraph
  var hasOG = hasOGMetaData(data.openGraph);
  if (!hasOG) {
    showOGWarning();
  }
  toggleOGImageHeading(data.openGraph);
  toggleOGArticleHeading(data.openGraph);
  toggleOGBookHeading(data.openGraph);

  var og = data.openGraph;
  toggleValueElement(
    og.title,
    'ogTitleContainer',
    'ogTitleValue'
  );
  toggleValueElement(
    og.description,
    'ogDescriptionContainer',
    'ogDescriptionValue'
  );
  toggleValueElement(
    og.siteName,
    'ogSiteNameContainer',
    'ogSiteNameValue'
  );
  toggleValueElement(
    og.url,
    'ogSiteURLContainer',
    'ogSiteURLValue'
  );
  toggleValueElement(
    og.locale,
    'ogLocaleContainer',
    'ogLocaleValue'
  );
  setOGImage(og.image.http, og.image.https, og.image.alt);
  toggleValueElement(
    og.image.http,
    'ogImageContainer',
    'ogImageValue'
  );
  toggleValueElement(
    og.image.https,
    'ogHttpsImageContainer',
    'ogHttpsImageValue'
  );
  toggleValueElement(
    og.image.alt,
    'ogImageAltContainer',
    'ogImageAltValue'
  );
  if (
    !og.article.author
    && !og.article.section
    && !og.article.published
    && !og.article.modified
  ) {
    var ogArticleHeading = document.getElementById('ogArticleHeading');
    ogArticleHeading.style.display = 'none';
  }
  toggleValueElement(
    og.article.author,
    'ogArticleAuthorContainer',
    'ogArticleAuthorValue'
  );
  toggleValueElement(
    og.article.section,
    'ogSectionContainer',
    'ogSectionValue'
  );
  toggleValueElement(
    og.article.published,
    'ogPublishedDateContainer',
    'ogPublishedDateValue'
  );
  toggleValueElement(
    og.article.modified,
    'ogModifiedDateContainer',
    'ogModifiedDateValue'
  );
  if (!og.book.author && !og.book.releaseDate) {
    var ogBookHeading = document.getElementById('ogBookHeading');
    ogBookHeading.style.display = 'none';
  }
  toggleValueElement(
    og.book.author,
    'ogBookAuthorContainer',
    'ogBookAuthorValue'
  );
  toggleValueElement(
    og.book.releaseDate,
    'ogReleaseDateContainer',
    'ogReleaseDateValue'
  );

  // twitter card
  var hasTC = hasTCMetaData(data.twitterCard);
  if (!hasTC) {
    showTCWarning();
  }
  toggleTCImageHeading(data.twitterCard);

  var tc = data.twitterCard;
  toggleValueElement(
    tc.username,
    'tcUsernameContainer',
    'tcUsernameValue'
  );
  toggleValueElement(
    tc.title,
    'tcTitleContainer',
    'tcTitleValue'
  );
  toggleValueElement(
    tc.titleText,
    'tcTitleTextContainer',
    'tcTitleTextValue'
  );
  toggleValueElement(
    tc.description,
    'tcDescriptionContainer',
    'tcDescriptionValue'
  );
  setTCImage(tc.image.url, tc.image.src, tc.image.alt);
  toggleValueElement(
    tc.image.url,
    'tcImageContainer',
    'tcImageValue'
  );
  toggleValueElement(
    tc.image.src,
    'tcImageSrcContainer',
    'tcImageSrcValue'
  );
  toggleValueElement(
    tc.image.alt,
    'tcImageAltContainer',
    'tcImageAltValue'
  );

  // show all results
  var results = document.getElementById('resultsContainer');
  results.classList.add('visible');
}

function hideResults() {
  var results = document.getElementById('resultsContainer');
  results.classList.remove('visible');
}

async function onCopyButtonClicked(event) {
  const button = event.target;
  const fieldId = button.dataset.for;
  const field = document.getElementById(fieldId)

  try {
    await navigator.clipboard.writeText(field.value);

  } catch (error) {
    console.log('Unable to copy:', error);
    console.log('button:', button);
    console.log('fieldId:', fieldId);
    console.log('field:', field);
  }
}


// spinner methods
function showSpinner() {
  var spinner = document.getElementById('spinnerContainer');
  spinner.classList.add('visible');
}

function hideSpinner() {
  var spinner = document.getElementById('spinnerContainer');
  spinner.classList.remove('visible');
}


// error message
function showError() {
  var errorMessage = document.getElementById('errorMessage');
  errorMessage.style.display = 'block';
}

function hideError() {
  var errorMessage = document.getElementById('errorMessage');
  errorMessage.style.display = 'none';
}

function showOGWarning() {
  var warning = document.getElementById('ogWarning');
  warning.style.display = 'block';
}

function hideOGWarning() {
  var warning = document.getElementById('ogWarning');
  warning.style.display = 'none';
}

function showTCWarning() {
  var warning = document.getElementById('tcWarning');
  warning.style.display = 'block';
}

function hideTCWarning() {
  var warning = document.getElementById('tcWarning');
  warning.style.display = 'none';
}


// dom methods
function showElement(element) {
  element.style.display = 'block';
}

function hideElement(element) {
  element.style.display = 'none';
}

function toggleValueElement(value, containerId, valueId) {
  var metaTitleContainer = document.getElementById(containerId);
  if (value) {
    showElement(metaTitleContainer);
    var valueElement = document.getElementById(valueId);
    valueElement.value = value;
    valueElement.disabled = true;
  } else {
    hideElement(metaTitleContainer)
  }
}

function setOGImage(httpUrl, httpsUrl, altText) {
  var ogImage = document.getElementById('ogImage');

  if (!httpUrl && !httpsUrl) {
    ogImage.style.display = 'none';
    return;
  }

  var imageSrc = (httpsUrl) ? httpsUrl : httpUrl;

  ogImage.setAttribute('src', imageSrc);
  ogImage.setAttribute('alt', altText);
  ogImage.setAttribute('title', altText);
  ogImage.style.display = 'block';
}

function setTCImage(img, imgSrc, altText) {
  var tcImage = document.getElementById('tcImage');

  if (!img && !imgSrc) {
    tcImage.style.display = 'none';
    return;
  }

  var imageSrc = (imgSrc) ? imgSrc : img;

  tcImage.setAttribute('src', imageSrc);
  tcImage.setAttribute('alt', altText);
  tcImage.setAttribute('title', altText);
  tcImage.style.display = 'block';
}

function hasOGMetaData(data) {
  return (
    data.title !== ''
    || data.description !== ''
    || data.siteName !== ''
    || data.url !== ''
    || data.locale !== ''
    || hasOGImage(data)
    || hasOGArticle(data)
    || hasOGBook(data)
  );
}

function hasOGImage(data) {
  return (
    data.image.http !== ''
    || data.image.https !== ''
    || data.image.alt !== ''
  );
}

function toggleOGImageHeading(data) {
  var hasImage = hasOGImage(data);
  var heading = document.getElementById('ogImageHeading');
  heading.style.display = hasImage ? 'block' : 'none';
}

function hasOGArticle(data) {
  return (
    data.article.author !== ''
    || data.article.section !== ''
    || data.article.published !== ''
    || data.article.modified !== ''
  );
}

function toggleOGArticleHeading(data) {
  var hasArticle = hasOGArticle(data);
  var heading = document.getElementById('ogArticleHeading');
  heading.style.display = hasArticle ? 'block' : 'none';
}

function hasOGBook(data) {
  return (
    data.book.author !== ''
    || data.book.releaseDate !== ''
  );
}

function toggleOGBookHeading(data) {
  var hasBook = hasOGArticle(data);
  var heading = document.getElementById('ogBookHeading');
  heading.style.display = hasBook ? 'block' : 'none';
}

function hasTCMetaData(data) {
  return (
    data.username !== ''
    || data.title !== ''
    || data.titleText !== ''
    || data.description !== ''
    || hasTCImage(data)
  );
}

function hasTCImage(data) {
  return (
    data.image.url !== ''
    || data.image.src !== ''
    || data.image.alt !== ''
  );
}

function toggleTCImageHeading(data) {
  var hasImage = hasTCImage(data);
  var heading = document.getElementById('tcImageHeading');
  heading.style.display = hasImage ? 'block' : 'none';
}
