# Grafo 
grafo = {
    1: {5:1, 4:3, 3:2},
    3: {1:2, 2:8, 6:3},
    2: {3:8, 4:4, 6:4},
    4: {1:3, 2:4, 5:2, 8:8, 7:6},
    5: {1:1, 4:2, 12:14},
    6: {2:4, 3:3, 7:7},
    7: {4:6, 6:7, 12:4},
    8: {4:8, 12:3, 9:10},
    9: {8:10, 12:6, 10:11},
    10: {9:11, 11:12, 13:6},
    11: {12:10, 10:12, 14:5},
    12: {5:14, 8:3, 9:6, 11:10, 7:4},
    13: {10:6, 14:7},
    14: {11:5, 13:7}
}

# Heurística 
h = {
    1:14, 2:12, 3:13, 4:11,
    5:10, 6:9, 7:8, 8:7,
    9:6, 10:4, 11:3, 12:5,
    13:2, 14:0
}


def a_estrella(inicio, objetivo):

    abierta = [inicio]
    cerrada = []

    g = {inicio: 0}
    padre = {}

    while abierta:

        # elegir el mejor nodo
        actual = abierta[0]
        for nodo in abierta:
            if g.get(nodo, float('inf')) + h.get(nodo, float('inf')) < g.get(actual, float('inf')) + h.get(actual, float('inf')):
                actual = nodo

        # si llegamos
        if actual == objetivo:
            camino = []
            while actual in padre:
                camino.append(actual)
                actual = padre[actual]
            camino.append(inicio)
            camino.reverse()

            print("Lista cerrada:", cerrada)
            return camino

        abierta.remove(actual)
        cerrada.append(actual)

        # recorrer vecinos
        if actual not in grafo:
            continue

        for vecino in grafo[actual]:

            if vecino in cerrada:
                continue

            nuevo_g = g[actual] + grafo[actual][vecino]

            if vecino not in g or nuevo_g < g[vecino]:
                padre[vecino] = actual
                g[vecino] = nuevo_g

                if vecino not in abierta:
                    abierta.append(vecino)

    return None


inicio = 1
objetivo = 14

camino = a_estrella(inicio, objetivo)

if camino:
    print("Camino encontrado:", camino)
else:
    print("No hay camino")