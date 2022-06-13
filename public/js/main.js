function procuraAndar(evt)
{
	let sala = document.querySelector("#sala");
	sala.innerHTML = '<option value="" disabled selected hidden>Selecione...</option>';
	
	if(evt.target.id == 'unidade')
	{
		let andar = document.querySelector("#andar");
		andar.innerHTML = '<option value="" disabled selected hidden>Selecione...</option>';
		sala.disabled = true;
	}
	
	const unidade = document.querySelector("#unidade").value;
	if (evt.target.id == 'unidade')
		fetch(`/add-new/${unidade}`)
		.then(response => response.json())
		.then((data) => {
			data.forEach(el => {
				andar.innerHTML += `<option value="${el.andar}">${el.andar}</option>`;
			});	
			andar.disabled = false;
			console.log(andar);
		})
		.catch(err => console.error(err));
	else
		fetch(`/add-new/${unidade}/${andar.value}`)
		.then(response => response.json())
		.then((data) => {
			data.forEach(el => {
				sala.innerHTML += `<option value="${el.nome}">${el.nome}</option>`;
			});	
			sala.disabled = false;
			console.log(sala);
		})
		.catch(err => console.error(err));
}

// function procuraSala()
// {	
// 	const sala = document.querySelector("#sala");

// 	fetch('/sala')
// 	.then(response => response.json())
// 	.then((data) => {
// 		console.log(data)
// 		//sala.value = data;
// 	})
// 	.catch(err => console.error(err));
// }