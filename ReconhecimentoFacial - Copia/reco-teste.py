import os
import cv2
import face_recognition
import tkinter as tk
from tkinter import simpledialog, messagebox
import threading
import sqlite3
from datetime import datetime
import numpy as np

# Constantes
PASTA_ROSTOS = "rostos_cadastrados"
DB_PATH = "rostos.db"

# Garantir pastas e banco
if not os.path.exists(PASTA_ROSTOS):
    os.makedirs(PASTA_ROSTOS)

def inicializar_banco():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            imagem_path TEXT NOT NULL,
            data_cadastro TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def salvar_usuario_no_banco(nome, caminho_imagem):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    data_cadastro = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        INSERT INTO usuarios (nome, imagem_path, data_cadastro)
        VALUES (?, ?, ?)
    ''', (nome, caminho_imagem, data_cadastro))
    conn.commit()
    conn.close()

def carregar_usuarios_do_banco():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT nome, imagem_path FROM usuarios')
    dados = cursor.fetchall()
    conn.close()
    return dados


def capturar_rosto():
    nome = simpledialog.askstring("Cadastro", "Digite o nome da pessoa:")
    if not nome:
        return

    def processo_captura():
        video_capture = cv2.VideoCapture(0)
        if not video_capture.isOpened():
            messagebox.showerror("Erro", "Não foi possível acessar a câmera.")
            return

        messagebox.showinfo("Instrução", "Posicione o rosto na câmera. Pressione 'c' para capturar.")

        while True:
            ret, frame = video_capture.read()
            if not ret:
                messagebox.showerror("Erro", "Falha ao capturar imagem.")
                break

            cv2.imshow('Cadastro de Rosto', frame)
            if cv2.waitKey(1) & 0xFF == ord('c'):
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                face_locations = face_recognition.face_locations(rgb_frame)

                if len(face_locations) == 1:
                    top, right, bottom, left = face_locations[0]
                    rosto = frame[top:bottom, left:right]
                    caminho = os.path.join(PASTA_ROSTOS, f"{nome}.jpg")
                    cv2.imwrite(caminho, rosto)
                    salvar_usuario_no_banco(nome, caminho)
                    messagebox.showinfo("Sucesso", f"Rosto de {nome} cadastrado com sucesso!")
                elif len(face_locations) > 1:
                    messagebox.showwarning("Aviso", "Mais de um rosto detectado. Tente novamente.")
                else:
                    messagebox.showwarning("Aviso", "Nenhum rosto detectado. Tente novamente.")
                break

        video_capture.release()
        cv2.destroyAllWindows()

    threading.Thread(target=processo_captura).start()


def reconhecer_rosto():
    def processo_reconhecimento():
        rostos_conhecidos = []
        nomes_conhecidos = []

        dados_usuarios = carregar_usuarios_do_banco()
        for nome, caminho in dados_usuarios:
            if os.path.exists(caminho):
                imagem = face_recognition.load_image_file(caminho)
                encodings = face_recognition.face_encodings(imagem)
                if encodings:
                    rostos_conhecidos.append(encodings[0])
                    nomes_conhecidos.append(nome)

        if not rostos_conhecidos:
            messagebox.showinfo("Aviso", "Nenhum rosto cadastrado foi encontrado.")
            return

        video_capture = cv2.VideoCapture(0)
        if not video_capture.isOpened():
            messagebox.showerror("Erro", "Não foi possível acessar a câmera.")
            return

        messagebox.showinfo("Instrução", "Posicione o rosto na câmera para reconhecimento. Pressione 'q' para sair.")

        while True:
            ret, frame = video_capture.read()
            if not ret:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for (top, right, bottom, left), encoding in zip(face_locations, face_encodings):
                matches = face_recognition.compare_faces(rostos_conhecidos, encoding)
                nome = "Desconhecido"

                face_distances = face_recognition.face_distance(rostos_conhecidos, encoding)
                if len(face_distances) > 0:
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        nome = nomes_conhecidos[best_match_index]

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
                cv2.putText(frame, nome, (left + 6, bottom - 6),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

            cv2.imshow('Reconhecimento Facial', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        video_capture.release()
        cv2.destroyAllWindows()

    threading.Thread(target=processo_reconhecimento).start()


def iniciar_interface():
    inicializar_banco()
    root = tk.Tk()
    root.title("Sistema de Reconhecimento Facial")
    root.geometry("300x200")

    tk.Button(root, text="Cadastrar Rosto", command=capturar_rosto, width=25).pack(pady=10)
    tk.Button(root, text="Reconhecer Rosto", command=reconhecer_rosto, width=25).pack(pady=10)
    tk.Button(root, text="Sair", command=root.quit, width=25).pack(pady=10)

    root.mainloop()


if __name__ == '__main__':
    iniciar_interface()