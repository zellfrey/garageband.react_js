class Note < ApplicationRecord
    has_many :rectangles
    has_many :projects, through: :rectangles
end
