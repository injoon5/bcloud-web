let MenuTarget_Backup = new Array();
let SelectedItems_Backup = new Array();

function openRenameModal() {
    if (SelectedItems.length >= 1) {
        var target = SelectedItems[SelectedItems.length - 1];
        SelectedItems_Backup = SelectedItems;
    } else if (MenuTarget !== undefined) {
        var target = MenuTarget.children[0].lastElementChild;
        MenuTarget_Backup = MenuTarget;
    } else return;

    document.getElementById('InputNewName').value = target.innerText.substr(0, target.innerText.length - target.dataset.ext.length)

    let custom = document.createEvent("MouseEvents");
    custom.initEvent("click", true, true);
    document.getElementById('openRenameModal').dispatchEvent(custom);
}

function renameSave() {
    showLoading(true);

    if (SelectedItems_Backup.length >= 1) {
        var target = SelectedItems_Backup[SelectedItems_Backup.length - 1];
        SelectedItems_Backup = new Array();
    } else if (MenuTarget_Backup !== undefined) {
        var target = MenuTarget_Backup.children[0].lastElementChild;
        MenuTarget_Backup = new Array();
    } else return;

    let input = document.getElementById('InputNewName');

    if (input.value === target.innerText.substr(0, target.innerText.length - target.dataset.ext.length)) return;

    $.ajax({
        url : "http://bcloudapi.kro.kr:3000/rename",
        data : {
            id : Id,
            key : Session,
            dir : Path,
            currname : target.innerText,
            newname : input.value + target.dataset.ext
        },
        method : "POST",
        success : function(json){
            if (!json.rename.error) {
                Session = json.session.key;
                reloadFileList().then(() => {
                    checkItemCut();
                    showLoading(false);
                });
                $('#RenameModal').modal('hide');
                toastr.success('이름 변경 완료!');
            } else {
                if (json.result) Session = json.session.key;

                toastr.error('이름 변경 실패');
            }
        }
    })
}



function openCreateFolderModal() {
    document.getElementById('InputFolderName').value = '새 폴더';

    let custom = document.createEvent("MouseEvents");
    custom.initEvent("click", true, true);
    document.getElementById('openCreateFolderModal').dispatchEvent(custom);
}

function createFolderSave() {
    showLoading(true);

    let input = document.getElementById('InputFolderName');

    $.ajax({
        url : "http://bcloudapi.kro.kr:3000/createfolder",
        data : {
            id : Id,
            key : Session,
            dir : Path,
            name : input.value
        },
        method : "POST",
        success : function(json){
            if (!json.createfolder.error) {
                Session = json.session.key;
                reloadFileList().then(() => {
                    checkItemCut();
                    showLoading(false);
                });
                $('#CreateFolderModal').modal('hide');
                toastr.success('폴더 생성 완료!');
            } else {
                if (json.result) Session = json.session.key;

                toastr.error('폴더 생성 실패');
            }
        }
    })
}

function openRemoveModal() {
    if (SelectedItems.length >= 1) {
        var target = SelectedItems[SelectedItems.length - 1];
        SelectedItems_Backup = SelectedItems;
    } else if (MenuTarget !== undefined) {
        var target = MenuTarget.children[0].lastElementChild;
        MenuTarget_Backup = MenuTarget;
    } else return;

    if (target.dataset.ext === '') document.getElementById('RemoveConfirmText').innerText = `정말 ${target.innerText} 폴더를 삭제하시겠습니까?\n폴더 안에 있는 파일이 모두 삭제됩니다!`;
    else document.getElementById('RemoveConfirmText').innerText = `정말 ${target.innerText} 파일을 삭제하시겠습니까?\n삭제한 파일은 복구할 수 없습니다!`;

    let custom = document.createEvent("MouseEvents");
    custom.initEvent("click", true, true);
    document.getElementById('openRemoveModal').dispatchEvent(custom);
}

function removeSave() {
    showLoading(true);

    if (SelectedItems_Backup.length >= 1) {
        var target = SelectedItems_Backup[SelectedItems_Backup.length - 1];
        SelectedItems_Backup = new Array();
    } else if (MenuTarget_Backup !== undefined) {
        var target = MenuTarget_Backup.children[0].lastElementChild;
        MenuTarget_Backup = new Array();
    } else return;

    $.ajax({
        url : "http://bcloudapi.kro.kr:3000/remove",
        data : {
            id : Id,
            key : Session,
            dir : Path,
            target : target.innerText
        },
        method : "POST",
        success : function(json){
            if (!json.remove.error) {
                Session = json.session.key;
                reloadFileList().then(() => {
                    checkItemCut();
                    showLoading(false);
                });
                $('#RemoveModal').modal('hide');
                toastr.success('파일 삭제 완료!');
            } else {
                if (json.result) Session = json.session.key;

                toastr.error('파일 삭제 실패');
            }
        }
    })
}