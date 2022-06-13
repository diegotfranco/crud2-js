//conecta com o db
const pool = require('../connect');

//view ocorrencias
exports.view = (req, res) =>{
	//conecta DB
	pool.getConnection((err, conn) => {
		if(err)
			throw err;
		console.log(`Conectado ao view com o ID ${conn.threadId}`);

		//utilizando a conexão
		conn.query(`SELECT o.id AS "codigo", data_hora AS "data", cat.nome AS "categoria", situacao, andar,
							s.nome AS "sala", unidade, CONCAT_WS(' ', col.nome, col.sobrenome) AS "solicitante"
					FROM ocorrencia o 
						JOIN categoria cat ON o.fk_categoria = cat.id
						JOIN sala s ON o.fk_sala = s.id 
						JOIN colaborador col ON o.fk_colaborador = col.id 
					ORDER BY data_hora DESC;`, (err, rows) =>{
			//libera a conexão, quando finaliza a ação
			conn.release();			
			if(!err)
			{
				rows.forEach(row => {
					row.data = row.data.toLocaleString('pt-BR');
				});
				res.render('home', {rows});
			}
			else
				console.log(err);
			
			console.log('os dados da tabela ocorrencia:\n', rows.slice(0, 1));
		});
	});
}

//find ocorrencias pela busca
exports.find = (req, res) =>{
	//conecta DB
	pool.getConnection((err, conn) => {
		if(err)
			throw err;
		console.log(`Conectado ao find com o ID ${conn.threadId}`);

		let termoBusca = req.body.searchInput;
		//utilizando a conexão
		conn.query(`SELECT o.id AS "codigo", data_hora AS "data", cat.nome AS "categoria", situacao, andar,
							s.nome AS "sala", unidade, CONCAT_WS(' ', col.nome, col.sobrenome) AS "solicitante"
					FROM ocorrencia o 
						JOIN categoria cat ON o.fk_categoria = cat.id
						JOIN sala s ON o.fk_sala = s.id 
						JOIN colaborador col ON o.fk_colaborador = col.id 
					WHERE o.id LIKE'%${termoBusca}%'
					OR cat.nome LIKE'%${termoBusca}%'
					OR situacao LIKE'%${termoBusca}%'
					OR andar LIKE'%${termoBusca}%'
					OR s.nome LIKE'%${termoBusca}%'
					OR unidade LIKE'%${termoBusca}%'
					OR  CONCAT_WS(' ', col.nome, col.sobrenome) LIKE'%${termoBusca}%'`, (err, rows) =>{
			//libera a conexão, quando finaliza a ação
			conn.release();			
			if(!err)
			{
				rows.forEach(row => {
					row.data = row.data.toLocaleString('pt-BR');
				});
				res.render('home', {rows});
			}
			else
				console.log(err);
			
			console.log('os dados da tabela ocorrencia:\n', rows);
		});
	});
}

exports.addForm = (req, res) =>{
	//conecta DB
	pool.getConnection((err, conn) => {
		if(err)
			throw err;
		console.log(`Conectado ao addForm com o ID ${conn.threadId}`);

		//utilizando a conexão
		conn.query('SELECT DISTINCT unidade FROM sala ORDER BY unidade ASC;', (err, unidades) =>{
			
			//libera a conexão, quando finaliza a ação
			conn.release();			
			if(!err)
			{
				//utilizando a conexão
				conn.query('SELECT nome FROM categoria ORDER BY nome ASC;', (err2, categorias) =>{

					//libera a conexão, quando finaliza a ação
					conn.release();			
					if(!err2)
						res.render('nova-ocorrencia', {unidades, categorias});
					else
						console.log(err2);

					console.log('as categorias da tabela categoria:\n', categorias);
				});
			}	
			else
				console.log(err);
			
			console.log('as unidades da tabela sala:\n', unidades);
		});
	});
}

//adiciona nova ocorrencia
exports.create = (req, res) =>{
	
	
	//conecta DB
	pool.getConnection((err, conn) => {

		const {email, unidade, andar, sala, categoria, img, descricao} = req.body;
		console.log(req.body);

		if(err)
			throw err;
		console.log(`Conectado ao add com o ID ${conn.threadId}`);
		conn.query('INSERT INTO Ocorrencia (fk_colaborador, fk_sala, fk_categoria, imagem, descricao) VALUES ((select id from colaborador where email = ?), (select id from sala where nome = ? and andar = ? and unidade = ?), (select id from categoria where nome = ?), ?, ?)',
					[email, sala, andar, unidade, categoria, img, descricao], (err, rows) =>{

			//libera a conexão, quando finaliza a ação
			conn.release();			
			if(!err)
				res.render('nova-ocorrencia', {alert: 'Usuário inserido com sucesso!'});
			else
				console.log(err);
		});
	});
}

//encontra andar pela unidade
exports.findAndar = (req, res) =>{
	console.log(req.params);
	const {unidade, andar} = req.params;
	
	//conecta DB
	pool.getConnection((err, conn) => {
		if(err)
			throw err;
			
		console.log(`Conectado ao find da sala com o ID ${conn.threadId}`);
		if(!andar)
		{
			//utilizando a conexão
			conn.query('SELECT DISTINCT andar FROM sala WHERE unidade = ?  ORDER BY andar ASC;', [unidade], (err, rows) =>{
				
				//libera a conexão, quando finaliza a ação
				conn.release();			
				if(!err)
					res.send(rows);
				else
					console.log(err);
				
				console.log(`os andares da unidade ${unidade}:\n`, rows);
			});
		}
		else
		{
			//utilizando a conexão
			conn.query('SELECT nome FROM sala WHERE unidade = ? AND andar = ? ORDER BY nome ASC;', [unidade, andar], (err, rows) =>{
				
				//libera a conexão, quando finaliza a ação
				conn.release();			
				if(!err)
					res.send(rows);
				else
					console.log(err);
				
				console.log(`as salas da unidade ${unidade} andar ${andar} sala:\n`, rows);
			});	
		}
	});
}



//edita uma ocorrencia
exports.edit = (req, res) =>{
	const {id} = req.params;
	
	//conecta DB
	pool.getConnection((err, conn) => {

		if(err)
			throw err;
		console.log(`Conectado ao edit com o ID ${conn.threadId}`);
		conn.query(`SELECT  email, unidade, andar, s.nome AS "sala", cat.nome AS "categoria", situacao, imagem, descricao
					FROM ocorrencia o 
						JOIN categoria cat ON o.fk_categoria = cat.id
						JOIN sala s ON o.fk_sala = s.id 
						JOIN colaborador col ON o.fk_colaborador = col.id 
					WHERE o.id = ?;`,[id],  (err, rows) =>{

			//libera a conexão, quando finaliza a ação
			conn.release();			
			if(!err)
				res.render('editar-ocorrencia', {rows});
			else
				console.log(err);

			console.log(rows)
		});
	});
}