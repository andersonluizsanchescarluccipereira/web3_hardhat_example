// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ContaCorrente {
    // --- Armazenamento ---
    mapping(address => uint256) private saldos;

    // --- Proteção simples contra reentrância ---
    bool private _lock;
    modifier nonReentrant() {
        require(!_lock, "Reentrancia");
        _lock = true;
        _;
        _lock = false;
    }

    // --- Eventos ---
    event Deposito(address indexed de, uint256 valor);
    event Saque(address indexed para, uint256 valor);
    event TransferenciaInterna(address indexed de, address indexed para, uint256 valor);
    event TransferenciaExterna(address indexed de, address indexed para, uint256 valor);

    // --- Depósito explícito ---
    function depositar() public payable {
        require(msg.value > 0, "Valor deve ser > 0");
        saldos[msg.sender] += msg.value;
        emit Deposito(msg.sender, msg.value);
    }

    // --- Receber ETH diretamente (credita no saldo interno) ---
    receive() external payable {
        require(msg.value > 0, "Valor deve ser > 0");
        saldos[msg.sender] += msg.value;
        emit Deposito(msg.sender, msg.value);
    }

    // --- Consulta de saldo (do remetente) ---
    function consultarSaldo() public view returns (uint256) {
        return saldos[msg.sender];
    }

    // --- Consulta de saldo (de qualquer conta) ---
    function saldoDe(address conta) public view returns (uint256) {
        return saldos[conta];
    }

    // --- Saque para o proprio remetente (envia ETH real) ---
    function sacar(uint256 valor) public nonReentrant {
        require(saldos[msg.sender] >= valor, "Saldo insuficiente");
        saldos[msg.sender] -= valor;

        (bool ok, ) = payable(msg.sender).call{value: valor}("");
        require(ok, "Falha no envio do ETH");

        emit Saque(msg.sender, valor);
    }

    // --- Saque para outro endereco (envia ETH real) ---
    function sacarPara(address destinatario, uint256 valor) public nonReentrant {
        require(destinatario != address(0), "Destinatario invalido");
        require(saldos[msg.sender] >= valor, "Saldo insuficiente");
        saldos[msg.sender] -= valor;

        (bool ok, ) = payable(destinatario).call{value: valor}("");
        require(ok, "Falha no envio do ETH");

        emit TransferenciaExterna(msg.sender, destinatario, valor);
    }

    // --- Transferencia interna (apenas move saldos dentro do contrato) ---
    function transferir(address destinatario, uint256 valor) public {
        require(destinatario != address(0), "Destinatario invalido");
        require(saldos[msg.sender] >= valor, "Saldo insuficiente");

        saldos[msg.sender] -= valor;
        saldos[destinatario] += valor;

        emit TransferenciaInterna(msg.sender, destinatario, valor);
    }

    // (Opcional) Saldo total de ETH mantido pelo contrato
    function saldoDoContrato() public view returns (uint256) {
        return address(this).balance;
    }
}
