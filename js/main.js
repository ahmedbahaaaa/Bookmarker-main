var siteNameInput = document.getElementById('site-name');
var siteURLInput = document.getElementById('site-url');
var searchInput = document.getElementById('searchInput');

var updateButton = document.getElementById('updateButton');
var addButton = document.getElementById('addButton');

var isvalidName = document.getElementById('isvalidName');
var isvalidURL = document.getElementById('isvalidURL');
var inputs = document.querySelectorAll('input');

var sitesRow = document.getElementById('sitesRow');

// Manipulate With inputs shadow
inputs.forEach((input) => {
    input.onfocus = function () {
        input.style.boxShadow = '#fff 0 0 8px 0'
    }

    input.onblur = function () {
        input.style.boxShadow = 'unset'
    }
})

// RegEx For Test Site Name & URL
function isValidName() {
    var regex = /^[a-zA-z0-9 ]{3,}$/g;
    if (regex.test(siteNameInput.value)) {
        isvalidName.classList.remove('invalid-data');
        isvalidName.classList.add('valid-data');
        siteNameInput.style.borderColor = '#4db465';
        siteNameInput.style.boxShadow = '#4db465 0 0 5px 0';
        isvalidName.innerHTML = `<i class="fa-solid fa-check fw-bolder fs-4"></i>`;
    } else {
        isvalidName.classList.remove('valid-data');
        isvalidName.classList.add('invalid-data');
        siteNameInput.style.borderColor = '#dc3545';
        siteNameInput.style.boxShadow = '#dc3545 0 0 8px 0';
        isvalidName.innerHTML = `!`

    }
}

function isValidURL(url) {
    var regex = /^https?:\/\/(www.)?([a-zA-Z0-9.-]+)\.[a-z]{2,4}(\/.*)?$/;

    if (regex.test(siteURLInput.value)) {
        isvalidURL.classList.remove('invalid-data');
        isvalidURL.classList.add('valid-data');
        siteURLInput.style.borderColor = '#4db465';
        siteURLInput.style.boxShadow = '#4db465 0 0 5px 0';
        isvalidURL.innerHTML = `<i class="fa-solid fa-check fw-bolder fs-4"></i>`;
    } else {
        isvalidURL.classList.remove('valid-data');
        isvalidURL.classList.add('invalid-data');
        siteURLInput.style.borderColor = '#dc3545';
        siteURLInput.style.boxShadow = '#dc3545 0 0 8px 0';
        isvalidURL.innerHTML = `!`
    }

    return regex.test(url);
}

siteURLInput.oninput = isValidURL;
siteNameInput.oninput = isValidName;

function removeValidationIcon() {
    isvalidName.innerHTML = '';
    isvalidURL.innerHTML = '';
    isvalidName.classList.remove('valid-data');
    isvalidURL.classList.remove('valid-data');
    siteNameInput.style.border = `1px solid #ccc`
    siteNameInput.style.boxShadow = `none`
    siteURLInput.style.border = `1px solid #ccc`
    siteURLInput.style.boxShadow = `none`
}

// Create Array & LocalStorage That Store All Bookmarks
var allBookmarks;

if (localStorage.getItem('allBookmarks')) {
    allBookmarks = JSON.parse(localStorage.getItem('allBookmarks'));

} else {
    allBookmarks = [];
    sitesRow.innerHTML = `<span id="noBookmarks" class="d-block">No Bookmarks Saved</span>`
}

// add a New Bookmark
function addBookmark() {

    var site = {
        name: siteNameInput.value,
        url: siteURLInput.value,
    }

    // Check if The Name Input Is Not Empty At First
    if (siteNameInput.value) {
        // Check if The URL Valid or Invalid
        if (isValidURL(site.url)) {
            allBookmarks.push(site);
            localStorage.setItem('allBookmarks', JSON.stringify(allBookmarks));

            clearFields();
            displayAllBookmarks();
            setBookmarksCount()
            removeValidationIcon();
            checkDeleteBtn()
        }

    } else {
        isValidName();
    }
}

// Create Function To Clear All Fields After The User Add New Bookmark
function clearFields() {
    siteNameInput.value = "";
    siteURLInput.value = "";
}

function displayOneBookmark(index) {
    sitesRow.innerHTML += `
    <div class="col-sm-6 col-xl-4">
        <div class="url-box">
        <h5 class="fw-bold p-3 text-center capitalize">${allBookmarks[index].name}</h5>
            <div class="btn-icons">
                <span class="icon">
                    <a href="${allBookmarks[index].url}" target="_black" class="viwe text-white">
                        <i class="fa-regular fa-eye me-2"></i>
                    </a>
                </span>
                <span class="icon update-icon text-white" onclick="preUpdate(${index})">
                    <i class="fa-solid fa-pen-to-square me-2"></i>
                </span>
                <span class="icon trash-icon text-white" onclick="deleteBookmark(${index})">
                    <i class="fa-solid fa-trash me-2"></i>
                </span>
            </div>
        </div>
    </div>
    `
}

function displayAllBookmarks() {
    sitesRow.innerHTML = "";
    for (var i = 0; i < allBookmarks.length; i++) {
        displayOneBookmark(i);
    }
}

displayAllBookmarks();

function deleteBookmark(index) {

    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
          if (willDelete) {
            allBookmarks.splice(index, 1);
            
            localStorage.setItem('allBookmarks', JSON.stringify(allBookmarks));
        
            displayAllBookmarks();
              setBookmarksCount();
              checkDeleteBtn()
            swal("deleted!", {
            icon: "success",
          });
        }
      });
}
// Create Var to Store The Index Value
var bookmarkIndex;

// Set Data into Inputs to update 
function preUpdate(index) {
    siteNameInput.value = `${allBookmarks[index].name}`;
    siteURLInput.value = `${allBookmarks[index].url}`;

    updateButton.classList.replace("d-none", "d-block");
    addButton.classList.replace("d-block", "d-none");

    bookmarkIndex = index;
}

function updateBookmark(index) {

    var site = {
        name: siteNameInput.value,
        url: siteURLInput.value,
    }

    allBookmarks.splice(bookmarkIndex, 1, site);
    localStorage.setItem('allBookmarks', JSON.stringify(allBookmarks));

    updateButton.classList.replace("d-block", "d-none");
    addButton.classList.replace("d-none", "d-block");

    displayAllBookmarks();
    clearFields();
    removeValidationIcon()
}


function searchIcon() {
    searchInput.focus();
}

function search() {

    sitesRow.innerHTML = "";

    for (var i = 0; i < allBookmarks.length; i++) {
        if (allBookmarks[i].name.includes(searchInput.value.toLowerCase())) {
            displayOneBookmark(i);
        }
    }
}


var bookmarksCount = document.getElementById('bookmarksCount');

function setBookmarksCount() {
    bookmarksCount.innerHTML = `${allBookmarks.length}`
}

setBookmarksCount();

function resetAllBookmarks() {

    if (allBookmarks.length > 0) {
            swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
          if (willDelete) {
            
            bookmarksCount.innerHTML = '0';
            allBookmarks = [];
            localStorage.clear();
              displayAllBookmarks();
              checkDeleteBtn()
          swal("deleted!", {
              icon: "success",
          });
        }
      });
    } 
    
    
}

var deleteAllBtn = document.getElementById('deleteAllBtn');

function checkDeleteBtn() {
    if (allBookmarks.length == 0) {

        sitesRow.innerHTML = '<div class="text-center fs-5 fw-medium text-white"> No Bookmarks yet !</div>'
        deleteAllBtn.style.opacity = '0.7';
        deleteAllBtn.style.cursor = 'not-allowed';
 
        siteNameInput.value = "";
        siteURLInput.value = "";
        updateButton.classList.replace("d-block", "d-none");
        addButton.classList.replace("d-none", "d-block");

    } else {
        deleteAllBtn.style.opacity = '1';
        deleteAllBtn.style.cursor = 'pointer'
    }
}

checkDeleteBtn()

