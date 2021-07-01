import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'

import Button from '@material-ui/core/Button'

import {Select, MenuItem } from '@material-ui/core'


const useStyles = makeStyles(() => ({
    container: {
        marginLeft: 10,
        marginRight: 10,
        maxHeight: 'calc(100vh - 150px)',
        height: '100%',
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
    //   backgroundColor: theme.palette.common.black,
    //   color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  
  }))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
root: {
    '&:nth-ot-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    },
},
}))(TableRow);


export default function FormData({segments, setJson}) {
    const defaultCategories = ['description', 'quantity', 'price']
    // const defaultCategories = segments.map((segment) => (segment[0]))

    //the array of categories available to the dropdown in the table
    const [categories, updateCategories] = useState(defaultCategories)
    
    //the ref to which selected catories are assigned
    const catRefs = useRef([])
    
    const [isChecked, setIsChecked] = useState([]);

    const toggleCheckboxValue = index => {
        setIsChecked(isChecked.map((v, n) => (n === index ? !v : v)));
    }
    const [finalSegments, setSegments] = useState({});

    //create an array of refs for each row
    const segmentsLength = segments.length;

    if(catRefs.current.length !== segmentsLength) {
        //initialises a new array of the length of the segments array, fills with undefined, assigns an iterant of catRefs.current in sequence, then assigns this new array to the existing .current property
        catRefs.current = Array(segmentsLength).fill().map((_, i) => 
            catRefs.current[i] = segments[i][0]
        )
    }

    //callback assigns the selected category to the TextField with the ref that has a matching index
    const setSelection = (index, event) => {
        catRefs.current[index] = event.target.value
        segments[index][0] = event.target.value
        console.log(catRefs)
        updateCategories(categories.filter(category => category !== event.target.value)) //to be amended to filter out items that exist in catRefs
        console.log(categories)
    }
    
    const setCategories = () => {
        isChecked.forEach((checked, i) => {
            if (checked) {
                finalSegments[segments[i][0]] = segments[i][1] //push to intermediary object instead of state object itself
            }
        })
        console.log(finalSegments)
        setJson(finalSegments)
    }
    
    useEffect(() => {
        setSegments(finalSegments)
    },[finalSegments])


    useEffect(() => {
        setIsChecked(segments.slice().fill(false))
    },[segments])

    const classes = useStyles()

    return (
        <TableContainer component={Paper} className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Available</StyledTableCell>
                    <StyledTableCell>Selected</StyledTableCell>
                    <StyledTableCell>Value</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {
                        segments ?
                        segments.map((segment, i) => {
                            if (segment !== "") {
                                return (
                                <StyledTableRow key={i}>
                                    <StyledTableCell>
                                        <TextField
                                            // ref={catRefs.current[i]}
                                            value={catRefs.current[i]} 
                                            disabled
                                        >
                                        </TextField>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Select
                                            onChange={setSelection.bind(this, i)}
                                        >
                                            {categories.map((category, j) => {
                                                return (
                                                    <MenuItem 
                                                        key={j}
                                                        value={category}
                                                    >
                                                        {category}
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Checkbox
                                            key={i}
                                            checked={isChecked[i] !== undefined ? isChecked[i] : false}
                                            inputProps={{'aria-label': 'primary checkbox'}}
                                            onClick={() => toggleCheckboxValue(i)}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>{segment[1]}</StyledTableCell>
                                </StyledTableRow>
                                )
                            } else {
                                return null
                            }
                        }) 
                        :
                        <StyledTableRow>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                        </StyledTableRow>
                    }
                </TableBody>
            </Table>
            <Button variant="outlined" type="button" onClick={setCategories}>set categories</Button>
        </TableContainer>
    )
}

