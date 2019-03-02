class ObjCache
{
    constructor(temp ,numb)
    {
        this.list = new Array(numb);
        this.tail = numb;

        temp.setEnabled(false);
        this.list[0] = temp;
        for(let i=1; i<numb; ++i)
        {
            let obj = GameObject.clone(temp, "ObjClone");
            obj.type = temp.type;
            obj.setEnabled(false);
            this.list[i] = obj;
        }
    }

    pop()
    {
        //console.log(this.tail)
        if(this.tail == 0)
            return null;

        let obj = this.list[--this.tail];
        obj.setEnabled(true);
        return obj;
    }

    push(obj)
    {   
        //console.log(this.tail)
        obj.setEnabled(false);
        this.list[this.tail++] = obj;
    }
}