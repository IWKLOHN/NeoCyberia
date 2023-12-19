/* eslint-disable react/prop-types */
import styles from './NewNoteModal.module.css';
import 'react-quill/dist/quill.snow.css';
import NoteIcon50 from '../../assets/note-icon-white50.svg';
import FolderIconYellow from '../../assets/folder-icon-yellow.svg';
import AddNoteIcon from '../../assets/add-note-icon.svg';
import AddNoteIconYellow from '../../assets/add-note-icon-yellow.svg';

import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import Modal from 'react-modal';
import axios, { all } from 'axios';

export const NewNoteModal = ({ isOpen, closeModal }) => {
	const [createMode, setCreateMode] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [area, setArea] = useState('');
	const [allNotes, setAllNotes] = useState([]);
	
	const [createArea, setCreateArea] = useState('');
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [picture, setPicture] = useState(null);
	const [editingNote, setEditingNote] = useState(null);

	const handleHover = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	// MÉTODOS AQUI
	const handleCreateNote = async (e) => {
		e.preventDefault();
		const newNote = new FormData();
		newNote.append('title', title);
		newNote.append('body', body);
		newNote.append('area', createArea);
		if(picture){
			newNote.append('image', picture);
		}
	
		const token = sessionStorage.getItem('token');
		const payload = JSON.parse(atob(token.split('.')[1]));
		const userId = payload._id; 
		
	
		newNote.append('userId', userId);
	
		try {
			const response = await axios.post(`${import.meta.env.VITE_AXIOS_URI}/notes/create`, 
			newNote,
			{
				headers:{
						Authorization: token,
						
				}
			});
			
			if(response.status === 201){
				setAllNotes([...allNotes, response.data]);
				setCreateMode(false);
				setTitle('');
				setCreateArea('');
				setBody('');
				setPicture(null);
			}
			else {
				console.log('Error creating note');
			}
			
		} catch (error) {
			console.error('Error creating', error);
		}
	};

	const handleUpdateNote = async (noteId) => {
			const token = sessionStorage.getItem('token');
			const updatedNote = new FormData();

			if(editingNote.title){
				updatedNote.append('title', editingNote.title);
			}
			if(editingNote.area){
				updatedNote.append('area', editingNote.area);
			}
			if(editingNote.body){
				updatedNote.append('body', editingNote.body);
			}
			if(editingNote.picture){
				updatedNote.append('image', editingNote.picture);
			}

		try {
			const response = await axios.put(`${import.meta.env.VITE_AXIOS_URI}/notes/update/${noteId}`, updatedNote, 
			{
				headers:{
						Authorization: token,
				}
			});
			
			if(response.status === 200){
				setAllNotes(prevNotes => ({
					...prevNotes,
					notes: prevNotes.notes.map(note => note._id === noteId ? {...response.data} : note)
				}));
				setEditingNote(null);
			}
			else {
				console.log('Error updating note');
			}
			
		} catch (error) {
			console.error('Error updating', error);
		}
	};

	const handleDeleteNote = async (noteId) => {
		const token = sessionStorage.getItem('token');
		try {
			const response = await axios.delete(`${import.meta.env.VITE_AXIOS_URI}/notes/delete/${noteId}`, {
				headers: {
					Authorization: token,
				},
			});
			if(response.status === 200){
				setAllNotes(prevNotes => ({
					...prevNotes,
					notes: prevNotes.notes.filter(note => note._id !== noteId)
				}));
			}
			else {
				console.log('Error deleting note');
			}
		} catch (error) {
			console.error('Error deleting', error);
		}
	};


	const getAllNotes = async () => {
		const token = sessionStorage.getItem('token');
		try {
			const response = await axios.get(`${import.meta.env.VITE_AXIOS_URI}/notes/all`, {
				headers: {
					Authorization: token,
				},
			});
			setAllNotes(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		getAllNotes();
		
	}

	, [editingNote]);



	return (
		<Modal
			isOpen={isOpen}
			contentLabel='New task'
			className={styles.customModal}
			overlayClassName={styles.customOverlay}
			onRequestClose={closeModal}>
			<section className={styles.menu}>
				<div className={styles.menuHeader}>
					<img src={NoteIcon50} alt='Note-icon' />
					<h2>MyNotes</h2>
					<p>{'(124 notes)'}</p>
				</div>

				<input type='text' placeholder='search notes' />

				<div className={styles.areaList}>
					<span className={styles.areaItem}>
						<img src={FolderIconYellow} alt='Folder-icon' />
						<p>
							All notes <span>{'(124 notes)'}</span>
						</p>
					</span>

					<span className={styles.areaItem}>
						<img src={FolderIconYellow} alt='Folder-icon' />
						<p>
							Work <span>{'(124 notes)'}</span>
						</p>
					</span>

					<span className={styles.areaItem}>
						<img src={FolderIconYellow} alt='Folder-icon' />
						<p>
							Studies <span>{'(124 notes)'}</span>
						</p>
					</span>

					<span className={styles.areaItem}>
						<img src={FolderIconYellow} alt='Folder-icon' />
						<p>
							Trip journal <span>{'(124 notes)'}</span>
						</p>
					</span>

					<span className={styles.areaItem}>
						<img src={FolderIconYellow} alt='Folder-icon' />
						<p>
							MyJournal <span>{'(124 notes)'}</span>
						</p>
					</span>
				</div>
			</section>
			<section className={styles.create}>
				{createMode ? (
					<form onSubmit={handleCreateNote}>
					<input 
						className={styles.noteTitle} 
						value={title}
						type='text' 
						placeholder='Note title' 
						onChange={e => setTitle(e.target.value)}
					/>
					<input 
						className={styles.noteArea} 
						value={createArea}
						type='text' 
						placeholder='Note area' 
						onChange={e => setCreateArea(e.target.value)}
					/>
					<input 
						className={styles.noteImage} 
						type='file' 
						onChange={e => setPicture(e.target.files[0])}
					/>
					<input 
						className={styles.noteBody} 
						value={body}
						type='text' 
						placeholder='Note body' 
						onChange={e => setBody(e.target.value)}
					/>
					<button className={styles.createButton} type='submit'>Create</button>
					
				</form>
				) : (
					<span
						className={styles.addNoteFloating}
						onMouseEnter={handleHover}
						onMouseLeave={handleMouseLeave}>
						<img
							src={isHovered ? AddNoteIconYellow : AddNoteIcon}
							alt='AddNote-icon'
							onClick={e => setCreateMode(true)}
						/>
					</span>
					
				)}
				<div>
						{Array.isArray(allNotes.notes) && allNotes.notes.map(note => (
							<div key={note._id}>
								<input type='text' value={editingNote 
									&& editingNote._id 
									=== note._id 
									? editingNote.title 
									: note.title} onChange={e => setEditingNote({...editingNote, title: e.target.value})} />
								<input type='text' value={editingNote 
									&& editingNote._id 
									=== note._id 
									? editingNote.area 
									: note.area} onChange={e => setEditingNote({...editingNote, area: e.target.value})} />
								<input type='text' value={editingNote 
									&& editingNote._id 
									=== note._id 
									? editingNote.body 
									: note.body} onChange={e => setEditingNote({...editingNote, body: e.target.value})} />
							{editingNote && editingNote._id === note._id && (
							<input type='file' onChange={e => setEditingNote({...editingNote, picture: e.target.files[0]})} />
							)}
							{editingNote && editingNote._id === note._id && editingNote.picture && <img style={{height:'50px'}} src={URL.createObjectURL(editingNote.picture)} alt="Preview" />}
								<img style={{height:'50px'}} src={note.imageUrl}></img>
							{editingNote && editingNote._id === note._id ? (
								<button onClick={() => handleUpdateNote(note._id)}>Save</button>
							) : (
								<div>
							<button onClick={() => setEditingNote(note)}>Edit</button>
							<button onClick={() => handleDeleteNote(note._id)}>Delete</button>
							</div>
						)}
					</div>
				))}
					</div>
			</section>
		</Modal>
	);
};


                <input type="text" value={testArea} onChange={(e) => setTestArea(e.target.value)} />
				<button onClick={() => getNotesByArea(testArea)}>Get notes by area</button>