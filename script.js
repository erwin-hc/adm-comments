const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;

var data = new Date();
var dia     = data.getDate();           // 1-31
var dia_sem = data.getDay();            // 0-6 (zero=domingo)
var mes     = data.getMonth();          // 0-11 (zero=janeiro)
var ano2    = data.getYear();           // 2 dígitos
var ano4    = data.getFullYear();       // 4 dígitos
var hora    = data.getHours();          // 0-23
var min     = data.getMinutes();        // 0-59
var seg     = data.getSeconds();        // 0-59
var mseg    = data.getMilliseconds();   // 0-999
var tz      = data.getTimezoneOffset(); // em minutos
var str_data = dia + '/' + (mes+1) + '/' + ano4;
var str_hora = hora + ':' + min + ':' + seg;
var data_hora = str_data + ' - ' + str_hora;

// Create element and render comments
const renderUser = doc => {
  const tr = `    
  <tr data-id='${doc.id}'>
  <td style = "text-transform:uppercase;">${doc.data().Nome}</td>     
  <td style = "text-transform:uppercase;">${doc.data().Data}</td>
  <td style = "text-transform:uppercase;">${doc.data().Comentario}</td>
  <td>
    <button class="btn btn-edit">Editar</button>
    <button class="btn btn-delete">Apagar</button>
  </td>
  </tr>
  `;
 
  tableUsers.insertAdjacentHTML('beforeend', tr);

  // Click edit user
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');

    id = doc.id;
    editModalForm.nome.value = doc.data().Nome;
    editModalForm.horario.value = doc.data().Data;
    editModalForm.comentario.value = doc.data().Comentario;

  });

  // Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () => {
    db.collection('comments').doc(`${doc.id}`).delete().then(() => {
      console.log('Document succesfully deleted!');
    }).catch(err => {
      console.log('Error removing document', err);
    });
  });

}

// Click add user button
btnAdd.addEventListener('click', () => {
  addModal.classList.add('modal-show');

  addModalForm.nome.value = '';
  addModalForm.horario.value = data_hora;
  addModalForm.comentario.value.replace(/\r?\n/g, "<br />") = '';
  });

// User click anyware outside the modal
window.addEventListener('click', e => {
  if(e.target === addModal) {
    addModal.classList.remove('modal-show');
  }
  if(e.target === editModal) {
    editModal.classList.remove('modal-show');
  }
});

// Get all comments
// db.collection('comments').get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     renderUser(doc);
//   })
// });

// Real time listener
db.collection('comments').orderBy("horario",'desc').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
      renderUser(change.doc);
    }
  })
})

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('comments').add({
    Nome: addModalForm.nome.value,
    Data: addModalForm.horario.value,
    Comentario: addModalForm.comentario.value,
  });
  modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('comments').doc(id).update({
    Nome: editModalForm.nome.value,
    Data: editModalForm.horario.value,
    Comentario: editModalForm.comentario.value,
  });
  editModal.classList.remove('modal-show');
  
});

