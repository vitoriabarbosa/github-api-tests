module.exports={
    type:'object',
    required:['id', 'number', 'state', 'title'],
    properties:{                                                             
        id: {type:'number'},
        number: {type:'number'},                                           
        state: {type:'string', enum:['open', 'closed']},
        title: {type:'string'}                                            
    }
}