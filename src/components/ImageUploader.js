import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Fade, Input } from 'reactstrap';

// ******************************************************************************
class ImageUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null
    }

    this.onChangeHandler = this.onChangeHandler.bind(this);
    
  }

  onChangeHandler(event) {

    if(event) {
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      }, () => {
        console.log(this.state.selectedFile)
      })
    }

  }

  render() {

    return (
      <div className="upload-container" style={{ alignSelf: 'flex-start' }}>
        <p style={{ fontSize: '14px' }}>add an image to your profile!</p>


        <Input className="form-control" bsSize="sm" 
          type="file" name="file" onChange={this.onChangeHandler}
          style={styles.input}>
        </Input>

        <Fade in={!!this.state.selectedFile}>
          <Button size="md" className="article-button add upload" style={styles.button}>
            upload pic
          </Button>
        </Fade>

      </div>
    );
  }
}

const styles = {

}

export default ImageUploader;
