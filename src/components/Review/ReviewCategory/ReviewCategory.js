import React from 'react'
import Select from 'react-select';
import { genreData } from '../../../genreData';
import { languageData } from '../../../languageData';
import './ReviewCategory.css'



export default class ReviewCategory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            language: 'en',
            genre: 28
        }
    }

    onLangCategoryChange = (event) => {
        this.setState({language: event.value})
        this.props.updateLanguageGenre(event.value, this.state.genre)
    }

    onGenreCategoryChange = (event) => {
        this.setState({genre: event.value})
        this.props.updateLanguageGenre(this.state.language, event.value);
    }

    render() {
        return (
            <div className="review-category">
                <h2>Select Category</h2>
                    <div className="vote-category">
                        <Select options={genreData} placeholder="Genre" className="category-item" onChange={this.onGenreCategoryChange}/>
                        <Select options={languageData} placeholder="Language" className="category-item" onChange={this.onLangCategoryChange}/>
                    </div>
            </div>
        )
    }  
}
