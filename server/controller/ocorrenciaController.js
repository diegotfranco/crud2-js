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
			
			console.log('os dados da tabela ocorrencia:\n', rows.slice(0, 5));

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
			
			console.log('os dados da tabela ocorrencia:\n', rows.slice(0, 1));

		});
	});
}