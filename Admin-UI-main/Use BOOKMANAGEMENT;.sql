Use BOOKMANAGEMENT;
SELECT * FROM Author;
SELECT * FROM Category;
SELECT * FROM Customer;
SELECT * FROM Book;
SELECT * FROM Ticket;

CREATE TABLE Ticketdetail 
(
    TicketId INT NOT NULL ,
    BookId int NOT NULL ,
    Quantity INT NOT NULL Check(Quantity>0),
    DeposiPrice FLOAT 
)

INSERT INTO Category(Name) VALUES
('Sách khoa học'),
('Tiểu thuyết'),
('Sách chính trị'),
('Sách văn hoá')
;

INSERT INTO Author(Name) VALUES
('ROBERT ADAM');

INSERT INTO Customer(Name,Email,Phone,Gender,Birthday) VALUES 
('Nguyễn Việt Anh','hung2@gmail.com','0987647821',1,'2004-01-18'),
('Đào Văn Khoa','hung3@gmail.com','0987976321',1,'1993-09-18'),
('Trương Diệu Linh','hung4@gmail.com','0987268321',0,'1995-07-18'),
('Đỗ Mỹ Ngọc','hung5@gmail.com','0987654451',0,'1998-05-18');

INSERT INTO Book(Name,[Status],Price,CategoryId,AuthorId)
VALUES
('Học toán vơi thầy Hùng',1,500000,2,2),
('Học lý với thầy Hùng',1,300000,2,2),
('Học hoá với thầy Hùng',1,300000,2,2),
('Rùa và Thỏ',1,200000,1,1),
('Chú dễ mèn',1,250000,1,1),
('Romio và Juliet',1,400000,3,3),
('Chiến Tranh và Hoà Bình',1,350000,3,3),
('Nàng Thơ',1,500000,3,3),
('Nghệ Thuật Quân Sự',1,400000,4,4),
('Hậu quả của chiến tranh',1,500000,4,4),
('Người lãnh tụ vĩ đại',1,800000,4,4),
('Bản sắc dân tộc',1,650000,5,5),
('54 Dân tộc Việt Nam',1,550000,5,5),
('Truyền thống yêu nước của dân tộc ta',1,900000,5,5);


INSERT INTO Ticket(CustomerId,[Status],TicketDate)