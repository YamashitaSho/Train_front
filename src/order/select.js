/**
 * キャラ・アイテム選択状態を保存するクラス
 */
var SelectState = function () {
    this.party_char = null;
    this.party_item = null;
    this.char = null;
    this.item = null;
    this.update = false;
};


/**
 * 各メンバ変数のgetter
 */
SelectState.prototype.getChar = function () {
    return this.char;
};


SelectState.prototype.getItem = function () {
    return this.item;
};


SelectState.prototype.getPartyChar = function () {
    return this.party_char;
};


SelectState.prototype.getPartyItem = function () {
    return this.party_item;
};


//キャラを選択した
SelectState.prototype.setChar = function (slot) {
    this.char = slot;
    this.update = true;
    return ;
};


//アイテムを選択した
SelectState.prototype.setItem = function (slot) {
    this.item = slot;
    this.update = true;
    return ;
};


//編成中キャラを選択した
SelectState.prototype.setPartyChar = function (party_char) {
    this.party_char = party_char;
    this.update = true;
    return ;
};


//編成中アイテムを選択した
SelectState.prototype.setPartyItem = function (party_item) {
    this.party_item = party_item;
    this.update = true;
    return ;
};


//更新フラグをオンにする
SelectState.prototype.setUpdate = function () {
    this.update = true;
    return ;
};


//更新フラグの状態を返し、オフに変更する
SelectState.prototype.isToUpdate = function () {
    var stat = this.update;
    this.update = false;
    return stat;
};


/**
 * 編成中キャラと待機キャラを選択しているか
 * @return boolean
 */
SelectState.prototype.canChangeChar = function () {
    var res = true;
    if ( (this.party_char === null) || (this.char === null)){
        res = false;
    }
    return res;
};


/**
 * 編成中キャラと待機キャラを選択しているか
 * @return boolean
 */
SelectState.prototype.canChangeItem = function (){
    var res = true;
    if ( (this.party_item === null) || (this.item === null)){
        res = false;
    }
    return res;
};