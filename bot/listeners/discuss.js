global.listen = false;
global.comments = new Array();
const util = require('./../util');
const knex = require('../../db');

module.exports = controller => {
    controller.hears(['^discuss '],['ambient','mention', 'direct_mention'],(bot,message)=>{
        console.log(message.text);
        var issue_id = util.extract_number(message.text);
        console.log(issue_id);
        if(issue_id == null) return;

        util.postOneIssue(issue_id,bot,message);
        recordMessages(controller,issue_id);
    });

    controller.hears(['end_discussion'],['ambient','mention', 'direct_mention'],(bot,message)=>{
        if(global.listen){
            global.listen = false;
            knex('comment')
            .insert(global.comments)
            .catch(error =>{
                console.log(error);
            });
        }
    });

}

function recordMessages(controller,issue_id){
    global.listen = true;
    controller.hears([''],['ambient'],(bot,message)=>{
        if(global.listen){
            console.log(message);
            global.comments.push({
                issue_id,
                user_id: message.user,
                text: message.text,
                posted_at: message.ts
            });
            console.log(global.comments);
        }
    });
}
