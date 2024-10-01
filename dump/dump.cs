public AFD EstadosSi(){

    int i, j, r;
    char ArrAlfabeto[];
    Si Sj, Sk; // De la clase Si
    bool existe;


    HashSet<Si> Estados = new HashSet<Si>();
    HashSet<Si> C = new HashSet<Si>();
    Queue<Si> Q = new Queue<Si>();

    C.Clear();
    Q.Clear();

    j = 0;

    Sj = new Si();
    {
        Si = CerraduraEpsilon(this.EdoInicial);
        j = j;
    }
    C.Add(Sj);
    Q.Enqueue(Sj);
    j++;

    while(Q.Count > 0){

        Sj = Q.Dequeue();

        foreach(char c in this.Alfabeto){
            Sk = new Si();
            {
                Si = IrA(Sj, c);
            };

            if(Sk.Si.Count == 0)
                continue;
            existe = false;
            foreach(Si I in C){
                if(I.Si.Count == Sk.Si.Count){
                    existe = true;

                    r = IndiceCaracter(ArrAlfabeto, c);
                    Sj.Transiciones[r] = I.j;
                    break;
                }




            }
        }
        if(!existe){
            Sk.j = j;
            r = IndiceCaracter(ArrAlfabeto, c);
            Sj.Transiciones[r] = Sk.j;
            C.Add(Sk);
            Q.Enqueue(Sk);
            j++;
        }
 




    }




}