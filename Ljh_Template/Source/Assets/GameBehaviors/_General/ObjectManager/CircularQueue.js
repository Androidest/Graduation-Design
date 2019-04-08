class CircularQueue
{
    constructor(temp, n, clearFunc, cloneFunc)
    {
        this.clearFunc = clearFunc;
        this.loopIndex = -1;
        this.numb = n;
        this.cache = new Array(n);
        this.cache[0] = temp;
        clearFunc(temp, 0);
        
        if(!cloneFunc)
            cloneFunc = GameObject.instantiate.bind(GameObject);

        for(let i=1; i<n; ++i)
        {
            let obj = cloneFunc(temp);
            clearFunc(obj, i);
            this.cache[i] = obj;
        }
    }

    clear()
    {
        this.loopIndex = -1;
        for(let i=0; i<this.numb; ++i)
            this.clearFunc(this.cache[i], i);
    }

    loopPop()
    {
        if(++this.loopIndex == this.numb)
            this.loopIndex = 0;
        return this.cache[this.loopIndex];
    }
}